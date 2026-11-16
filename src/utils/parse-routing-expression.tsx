import type { RuleGroupType, RuleType } from "react-querybuilder"
import type { Category } from "@/types/domain/reference-data"
import type { CategoryRuleValue } from "@/types/forms/create-expression"

type Atom = {
    type: "atom"
    field: string
    value: string
}

type Group = {
    type: "group"
    combinator: "and" | "or"
    children: Node[]
}

type Node = Atom | Group
type Token =
    | { type: "open" | "close" | "and" | "or" }
    | { type: "atom"; field: string; value: string }

/* Split expression code into recognizable tokens */
function tokenize(code: string): Token[] {
    const tokens: Token[] = []
    let position = 0

    const patterns = [
        /^location\s+in\s+areas\."district"\.("(?:\\.|[^"\\])*")/,
        /^([A-Za-z_][\w.-]*)\s*==\s*("(?:\\.|[^"\\])*")/,
    ]

    while (position < code.length) {
        const input = code.slice(position)
        const whitespace = input.match(/^\s+/)

        if (whitespace) {
            position += whitespace[0].length
            continue
        }

        if (input[0] === "(" || input[0] === ")") {
            tokens.push({ type: input[0] === "(" ? "open" : "close" })
            position++
            continue
        }

        const operator = input.match(/^(and|or)\b/i)

        if (operator) {
            tokens.push({ type: operator[1].toLowerCase() as "and" | "or" })
            position += operator[0].length
            continue
        }

        const area = input.match(patterns[0])

        if (area) {
            tokens.push({
                type: "atom",
                field: "area",
                value: JSON.parse(area[1]),
            })
            position += area[0].length
            continue
        }

        const condition = input.match(patterns[1])

        if (condition) {
            tokens.push({
                type: "atom",
                field: condition[1],
                value: JSON.parse(condition[2]),
            })
            position += condition[0].length
            continue
        }

        throw new Error(`Unknown expression syntax near: ${input.slice(0, 40)}`)
    }

    return tokens
}

/* Parse tokens into a nested logical tree */
function parseTokens(tokens: Token[]): Node {
    let position = 0

    function parsePrimary(): Node {
        const token = tokens[position++]

        if (!token) throw new Error("Unexpected end of expression")

        if (token.type === "atom") return token

        if (token.type === "open") {
            const node = parseOr()

            if (tokens[position]?.type !== "close") {
                throw new Error("Missing closing parenthesis")
            }

            position++
            return node
        }

        throw new Error(`Unexpected token: ${token.type}`)
    }

    function parseAnd(): Node {
        const children = [parsePrimary()]

        while (tokens[position]?.type === "and") {
            position++
            children.push(parsePrimary())
        }

        return children.length === 1
            ? children[0]
            : { type: "group", combinator: "and", children }
    }

    function parseOr(): Node {
        const children = [parseAnd()]

        while (tokens[position]?.type === "or") {
            position++
            children.push(parseAnd())
        }

        return children.length === 1
            ? children[0]
            : { type: "group", combinator: "or", children }
    }

    const result = parseOr()

    if (position !== tokens.length) {
        throw new Error("Unexpected tokens after expression")
    }

    return result
}

/* Convert an atom into a Query Builder rule */
function mapAtom(atom: Atom, categories: Category[], question?: Atom): RuleType {
    if (atom.field === "area") {
        if (question) throw new Error("Question cannot belong to an area")

        return {
            field: "area",
            operator: "=",
            value: [atom.value],
        }
    }

    if (atom.field !== "sub") {
        throw new Error(`Question without category: ${atom.field}`)
    }

    const category = categories.find(
        (category) => category.name === atom.value
    )

    if (!category) {
        throw new Error(`Unknown category: ${atom.value}`)
    }

    const categoryValue: CategoryRuleValue = {
        categories: [{
            category: String(category.id),
            question: question?.field ?? "",
            answer: question?.value ?? "",
        }],
    }

    return {
        field: "category",
        operator: "=",
        value: categoryValue,
    }
}

function isRule(rule: RuleGroupType | RuleType): rule is RuleType {
    return !("rules" in rule)
}

function mergeOrGroup(
    rules: (RuleGroupType | RuleType)[]
): RuleType | null {
    if (rules.length === 0) return null

    if (rules.every(
        (rule) => isRule(rule) && rule.field === "category"
    )) {
        const categories = rules
            .filter(isRule)
            .flatMap((rule) =>
                (rule.value as CategoryRuleValue).categories
            )

        return {
            field: "category",
            operator: "=",
            value: { categories },
        }
    }

    if (rules.every(
        (rule) => isRule(rule) && rule.field === "area"
    )) {
        const areas = rules
            .filter(isRule)
            .flatMap((rule) => rule.value as string[])

        return {
            field: "area",
            operator: "=",
            value: areas,
        }
    }

    return null
}


/* Convert the logical tree into React Query Builder data */
function mapNode(node: Node, categories: Category[]): RuleGroupType | RuleType {
    if (node.type === "atom") {
        return mapAtom(node, categories)
    }

    // A category and its question belong to one Query Builder rule.
    if (
        node.combinator === "and" &&
        node.children.length === 2 &&
        node.children[0].type === "atom" &&
        node.children[1].type === "atom" &&
        node.children[0].field === "sub" &&
        !["sub", "area"].includes(node.children[1].field)
    ) {
        return mapAtom(node.children[0], categories, node.children[1])
    }

    const rules = node.children.map((child) =>
        mapNode(child, categories)
    )

    if (node.combinator === "or") {
        const merged = mergeOrGroup(rules)

        if (merged) return merged
    }

    return {
        combinator: node.combinator,
        rules,
    }
}

/* Public parser: expression code -> Query Builder */
export function parseRoutingExpression(code: string, categories: Category[],): RuleGroupType {
    const tokens = tokenize(code)

    if (tokens.length === 0) {
        throw new Error("Cannot parse an empty expression")
    }

    const tree = parseTokens(tokens)
    const result = mapNode(tree, categories)

    return "rules" in result
        ? result
        : { combinator: "and", rules: [result] }
}
