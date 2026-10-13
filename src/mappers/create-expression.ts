import type { RoutingExpressionFormData } from "@/types/forms/create-expression"
import type { Expression } from "@/types/domain/routing"
import type {Category, Department} from "@/types/domain/reference-data"
import { convertConditionGroupToExpression } from "@/mappers/form-to-transfer.ts"

export function mapCreateExpressionFormToDomain(
    values: RoutingExpressionFormData,
    departments: Department[],
    categories: Category[]
): Expression {
    const department = departments.find(
        (department) => department.code === values.department
    )

    if (!department) {
        throw new Error("De geselecteerde afdeling is niet gevonden.")
    }

    const code = values.conditionGroups
        .map((group) =>
            convertConditionGroupToExpression(group, categories)
        )
        .filter(Boolean)
        .map((condition) => `(${condition})`)
        .join(" and ")

    return {
        id: crypto.randomUUID(),
        name: values.name,
        code,
        type: "routing",
        isActive: values.isActive,
        routing: {
            department,
            order: values.order,
        },
    }
}