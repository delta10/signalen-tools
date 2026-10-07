import type {
    Area,
    Question,
} from "@/types/domain/reference-data"
import type {Expression} from "@/types/domain/routing"

/* THIS FILE CONTAINS HELPER FUNCTIONS TO STRUCTURE ROUTING EXPRESSION DATA */

/* Helper function to extract all categories used by an Expression */
export function getExpressionCategories(
    expression: Expression
): string[] {
    return extractCategories(expression.code)
}

/* Extract category values from Expression code */
export function extractCategories(code: string): string[] {
    return [...code.matchAll(/sub\s*==\s*"([^"]+)"/g)]
        .map((match) => match[1])
}

/* Helper function to identify the types used by an Expression */
export type RoutingType = "area" | "question" | "category"

export const routingTypeLabels: Record<RoutingType, string> = {
    area: "Gebied",
    category: "Categorie",
    question: "Vraag",
}

export function getExpressionTypes(
    expression: Expression
): RoutingType[] {
    const types: RoutingType[] = []

    if (expression.code.includes("location in areas")) {
        types.push("area")
    }

    if (expression.code.includes("sub ==")) {
        types.push("category")
    }

    if (hasQuestion(expression.code)) {
        types.push("question")
    }

    return types
}

/* Helper function to extract area codes used by an Expression */
type RoutingArea = {
    type: string
    code: string
}

export function getExpressionAreas(
    expression: Expression
): RoutingArea[] {
    const matches = [
        ...expression.code.matchAll(
            /areas\.\s*"([^"]+)"\.\s*"([^"]+)"/g
        ),
    ]

    return matches.map((match) => ({
        type: match[1],
        code: match[2],
    }))
}

/* Convert area codes to readable area names */
export function getExpressionAreaNames(
    expression: Expression,
    areas: Area[]
): string[] {
    const routingAreas = getExpressionAreas(expression)

    return routingAreas.map((routingArea) => {
        const area = areas.find(
            (area) =>
                area.code === routingArea.code ||
                area.name === routingArea.code
        )

        return area?.name ?? routingArea.code
    })
}

/* Extract and format question and answer conditions from an Expression */
export function getExpressionQuestionsAnswers(
    expression: Expression,
    questions: Question[]
): string[] {
    const matches = expression.code.matchAll(
        /([A-Za-z0-9_]+)\s*==\s*"([^"]+)"/g
    )

    const groupedAnswers: Record<string, string[]> = {}

    for (const match of matches) {
        const questionKey = match[1]
        const rawAnswer = match[2]

        const question = questions.find(
            (question) => question.key === questionKey
        )

        if (!question) {
            continue
        }

        const answer =
            question.answers.find(
                (answer) => answer.value === rawAnswer
            )?.label ?? rawAnswer

        if (!groupedAnswers[questionKey]) {
            groupedAnswers[questionKey] = []
        }

        groupedAnswers[questionKey].push(answer)
    }

    return Object.entries(groupedAnswers).map(
        ([questionKey, answers]) =>
            `${questionKey} = ${answers.join(", ")}`
    )
}

/* Helper function to identify possible questions in Expression code */
function hasQuestion(expressionCode: string): boolean {
    const comparisonRegex =
        /([A-Za-z_][A-Za-z0-9_]*)\s*==\s*"[^"]+"/g

    const comparisons = [
        ...expressionCode.matchAll(comparisonRegex),
    ]

    return comparisons.some(
        (match) => match[1] !== "sub"
    )
}