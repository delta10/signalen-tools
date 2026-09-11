import type {Area, Department, Expression, Questions, RoutingExpression} from "@/types/routing-expressions.ts"

{/* THIS FILE CONTAINS HELPER FUNCTIONS TO STRUCTURE THE DATA SPREAD ACROSS MULTIPLE SOURCES */}

{/* Helper function to convert a department code to a readable department name */}
export function getDepartmentName(departmentCode: string, departments: Department[]) {
    const department = departments.find(
        (department) => department.code === departmentCode
    )

    if (!department) {
        return departmentCode
    }

    return department.name.replace(
        new RegExp(`\\s*\\(${departmentCode}\\)$`),
        ""
    )
}

{/* Helper function to get all categories used by a Routing Expression */}
export function getRoutingExpressionCategories(routingExpression: RoutingExpression, expressions: Expression[]): string[] {
    const expression = expressions.find(
        (expression) =>
            expression.name === routingExpression._expression
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
type RoutingType = "area" | "question" | "category"

export const routingTypeLabels: Record<RoutingType, string> = {
    area: "Gebied",
    category: "Categorie",
    question: "Vraag",
}

export function getRoutingExpressionTypes(routingExpression: RoutingExpression, expressions: Expression[]): RoutingType[] {
    const expression = expressions.find(
        (expression) => expression.name === routingExpression._expression
    )

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

    if (expression.code.includes("Onderwerp ==") || expression.code.includes("_type_melding ==")) {
        types.push("question")
    }

    return types
}

{/* Helper function to extract the area code used by a Routing Expression */}
export function getRoutingExpressionAreaCode(routingExpression: RoutingExpression, expressions: Expression[]) {
    const expression = expressions.find(
        (expression) => expression.name === routingExpression._expression
    )

    if (!expression) {
        return null
    }

    const match = expression.code.match(
        /areas\."district"\."([^"]+)"/
    )

    return match?.[1] ?? null
}

{/* ...then convert that code to a readable area name */}
export function getRoutingExpressionAreaName(routingExpression: RoutingExpression, expressions: Expression[], areas: Area[]) {
    const areaCode = getRoutingExpressionAreaCode(routingExpression, expressions)

    if (!areaCode) {
        return null
    }

    const area = areas.find(
        (area) => area.code === areaCode
    )

    return area?.name ?? areaCode
}

{/* Helper function to extract and format question and answer conditions from a Routing Expression */}
export function getRoutingExpressionQuestionsAnswers(routingExpression: RoutingExpression, expressions: Expression[], questions: Questions[]) {
    const expression = expressions.find(
        (expression) => expression.name === routingExpression._expression
    )
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