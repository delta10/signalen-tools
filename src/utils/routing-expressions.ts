import type {Department, Expression, RoutingExpression} from "@/types/routing-expressions.ts"

{/* Helper function for converting department name from code to something readable */}
export function convertDepartmentName(
    departmentCode: string,
    departments: Department[]
) {
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

{/* Helper function for converting routing expression to a list of categories */}
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

{/* Helper function for extracting categories from JSON */}
export function extractCategories(code: string): string[] {
    return [...code.matchAll(/sub\s*==\s*"([^"]+)"/g)]
        .map((match) => match[1])
}