import type {Area, Department, Expression, RoutingExpression} from "@/types/routing-expressions.ts"

{/* THIS FILE CONTAINS HELPER FUNCTIONS TO STRUCTURE THE DATA SPREAD ACROSS MULTIPLE SOURCES */}

{/* Helper function for converting department name from code to something readable */}
export function convertDepartmentName(departmentCode: string, departments: Department[]) {
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

{/* Helper function for extracting categories from Expression */}
export function convertRoutingExpressionToCategories(routingExpression: RoutingExpression, expressions: Expression[]): string[] {
    const expression = expressions.find(
        (expression) =>
            expression.name === routingExpression._expression
    )

    if (!expression) {
        return []
    }

    return extractCategories(expression.code)
}

{/* Now extract in something readable */}
export function extractCategories(code: string): string[] {
    return [...code.matchAll(/sub\s*==\s*"([^"]+)"/g)]
        .map((match) => match[1])
}

{/* Helper function for identifying Routing Expression Type in expressions in: "Gebied", "Categorie", "Vraag" */}
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

{/* Helper function for extracting area code from Expression */}
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

{/* Now convert that name to something readable by extracting from Area */}
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