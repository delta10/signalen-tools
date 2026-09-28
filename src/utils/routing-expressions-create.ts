import type {Expression, Questions, RoutingExpression,} from "@/types/routing-expressions.ts"
import type {RoutingConditionGroup, RoutingExpressionFormData,} from "@/types/routing-expressions-create.ts"


/* Helper function to extract possible answers from question.meta */
export function getQuestionAnswers(question: Questions): string[] {
    try {
        const meta = JSON.parse(question.meta)

        if (!meta.values) {
            return []
        }

        return Object.values(meta.values)
    } catch {
        return []
    }
}


/* Convert one condition value to expression code based on its group type */
export function convertConditionValueToExpression(group: RoutingConditionGroup, value: string,): string {
    switch (group.type) {
        case "category":
            return `sub == "${value}"`

        case "area":
            return `location in areas."district"."${value}"`

        case "question":
            return value

        default:
            return ""
    }
}


/* Convert one group to expression code */
export function convertConditionGroupToExpression(group: RoutingConditionGroup,): string {
    const separator =
        group.operator === "AND"
            ? " and "
            : " or "

    const expression = group.conditions
        .map((condition) =>
            convertConditionValueToExpression(group, condition.value)
        )
        .filter(Boolean)
        .join(separator)

    if (!expression) {
        return ""
    }

    return `(${expression})`
}


/* Convert all groups to expression code */
export function convertConditionsToExpression(formData: RoutingExpressionFormData,): string {
    const separator =
        formData.conditionOperator === "AND"
            ? " and "
            : " or "

    return formData.conditionGroups
        .map(convertConditionGroupToExpression)
        .filter(Boolean)
        .join(separator)
}


/* Helper function to create an Expression from form data */
export function createExpressionFromFormData(formData: RoutingExpressionFormData,): Expression {
    return {
        name: formData.name,
        code: convertConditionsToExpression(formData),
        _type: "routing",
    }
}


/* Helper function to create a RoutingExpression from form data */
export function createRoutingExpressionFromFormData(formData: RoutingExpressionFormData,): RoutingExpression {
    return {
        _expression: formData.name,
        _department: formData.department,
        _user: "",
        order: String(formData.order),
        is_active: formData.isActive ? "1" : "0",
    }
}


/* Helper function to convert routing expression form data */
export function convertRoutingExpressionFormData(formData: RoutingExpressionFormData,) {
    return {
        expression:
            createExpressionFromFormData(formData),

        routingExpression:
            createRoutingExpressionFromFormData(formData),
    }
}