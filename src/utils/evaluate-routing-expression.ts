import type { Category } from "@/types/domain/reference-data"
import type { RoutingSimulationData } from "@/types/routing-simulations"

type EvaluationData = {
    simulation: RoutingSimulationData
    categories: Category[]
}

/* Split expression code into conditions, operators and parentheses */
function tokenize(code: string): string[] {
    const pattern =
        /\s*(\(|\)|\band\b|\bor\b|location\s+in\s+areas\."(?:\\.|[^"\\])*"\."(?:\\.|[^"\\])*"|[A-Za-z_][A-Za-z0-9_]*\s*==\s*"(?:\\.|[^"\\])*")/gy

    const tokens: string[] = []
    let position = 0

    while (position < code.length) {
        if (!code.slice(position).trim()) break

        pattern.lastIndex = position
        const match = pattern.exec(code)

        if (!match) {
            throw new Error("Unsupported expression syntax")
        }

        tokens.push(match[1])
        position = pattern.lastIndex
    }

    return tokens
}

/* Evaluate an individual category, area or question condition */
function evaluateCondition(condition: string, { simulation, categories }: EvaluationData,): boolean {
    const areaMatch = condition.match(
        /^location\s+in\s+areas\.("(?:\\.|[^"\\])*")\.("(?:\\.|[^"\\])*")$/
    )

    if (areaMatch) {
        const areaCode = JSON.parse(areaMatch[2]) as string
        return simulation.area === areaCode
    }

    const comparison = condition.match(
        /^([A-Za-z_][A-Za-z0-9_]*)\s*==\s*("(?:\\.|[^"\\])*")$/
    )

    if (!comparison) {
        throw new Error("Unsupported condition")
    }

    const [, field, rawValue] = comparison
    const value = JSON.parse(rawValue) as string

    if (field === "sub") {
        const category = categories.find(
            (item) => item.slug === simulation.category
        )

        return category?.name === value
    }

    return (
        simulation.question === field &&
        simulation.answer === value
    )
}

/* Evaluate expression code recursively, respecting AND/OR precedence */
export function evaluateRoutingExpression(code: string, data: EvaluationData): boolean {
    const tokens = tokenize(code)
    let position = 0

    function parseCondition(): boolean {
        const token = tokens[position++]

        if (!token) {
            throw new Error("Incomplete expression")
        }

        if (token === "(") {
            const result = parseOr()

            if (tokens[position++] !== ")") {
                throw new Error("Missing closing parenthesis")
            }

            return result
        }

        if (token === ")" || token === "and" || token === "or") {
            throw new Error("Unexpected operator")
        }

        return evaluateCondition(token, data)
    }

    function parseAnd(): boolean {
        let result = parseCondition()

        while (tokens[position] === "and") {
            position++

            const next = parseCondition()
            result = result && next
        }

        return result
    }

    function parseOr(): boolean {
        let result = parseAnd()

        while (tokens[position] === "or") {
            position++

            const next = parseAnd()
            result = result || next
        }

        return result
    }

    if (tokens.length === 0) {
        throw new Error("Empty expression")
    }

    const matches = parseOr()

    if (position !== tokens.length) {
        throw new Error("Unexpected tokens in expression")
    }

    return matches
}
