import type {Area, Department, Expression, Questions, RoutingExpression} from "@/types/routing-expressions.ts"

{/* THIS FILE CONTAINS HELPER FUNCTIONS TO STRUCTURE THE DATA SPREAD ACROSS MULTIPLE SOURCES */}

{/* Helper function to convert a department code to a readable department name */}
export function getDepartmentName(departmentCode: string, departments: Department[]) {
    const department = departments.find(
        (department) => department.code === departmentCode
    )

    return department?.name ?? departmentCode
}

{/* Helper function to get all categories used by a Routing Expression */}
export function getRoutingExpressionCategories(routingExpression: RoutingExpression, expressions: Expression[]): string[] {
    const expression = expressions.find(
        (expression) => expression.name === routingExpression._expression
    )

    if (!expression) {
        return []
    }

    return extractCategories(expression.code)
}

{/* ...then extract category values from Expression code */}
export function extractCategories(code: string): string[] {
    return [...code.matchAll(/sub\s*==\s*"([^"]+)"/g)]
        .map((match) => match[1])
}

{/* Helper function to identify the types used by a Routing Expression */}
export type RoutingType = "area" | "question" | "category"

export const routingTypeLabels: Record<RoutingType, string> = {
    area: "Gebied",
    category: "Categorie",
    question: "Vraag",
}

export function getRoutingExpressionTypes(routingExpression: RoutingExpression, expressions: Expression[]): RoutingType[] {
    const expression = getExpressionFromRoutingExpression(routingExpression, expressions);

    if (!expression) {
        return []
    }

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

{/* Helper function to extract the area code used by a Routing Expression */}
type RoutingArea = {
    type: string
    code: string
}

export function getRoutingExpressionAreas(routingExpression: RoutingExpression, expressions: Expression[]): RoutingArea[] {
    const expression = getExpressionFromRoutingExpression(routingExpression, expressions);
    if (!expression) {
        return []
    }

    const matches = [
        ...expression.code.matchAll(
            /areas\.\s*"([^"]+)"\.\s*"([^"]+)"/g
        )
    ]

    return matches.map((match) => ({
        type: match[1],
        code: match[2],
    }))
}

{/* ...then convert that code to a readable area name */}
export function getRoutingExpressionAreaNames(routingExpression: RoutingExpression, expressions: Expression[], areas: Area[]): string[] {
    const routingAreas = getRoutingExpressionAreas(
        routingExpression,
        expressions
    )

    return routingAreas.map((routingArea) => {
        const area = areas.find(
            (area) =>
                area.code === routingArea.code || area.name === routingArea.code
        )

        return area?.name ?? routingArea.code
    })
}

{/* Helper function to extract and format question and answer conditions from a Routing Expression */}
export function getRoutingExpressionQuestionsAnswers(routingExpression: RoutingExpression, expressions: Expression[], questions: Questions[]) {
    const expression = getExpressionFromRoutingExpression(routingExpression, expressions);
    if (!expression) {
        return []
    }

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

        const meta = JSON.parse(question.meta)

        const answer =
            meta.values?.[rawAnswer] ?? rawAnswer

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

{/* Helper function to identify possible questions in string */}
function hasQuestion(expressionCode: string): boolean {
    const comparisonRegex =
        /([A-Za-z_][A-Za-z0-9_]*)\s*==\s*"[^"]+"/g

    const comparisons = [
        ...expressionCode.matchAll(comparisonRegex)
    ]

    return comparisons.some(
        (match) => match[1] !== "sub"
    )
}

{/* Helper function to find connection in Expression & Routing Expression */}
function getExpressionFromRoutingExpression(routingExpression: RoutingExpression, expressions: Expression[]): Expression | undefined {
    return expressions.find(
        (expression) =>
            expression.name === routingExpression._expression
    )
}