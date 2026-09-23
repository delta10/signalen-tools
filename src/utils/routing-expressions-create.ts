import type {Expression, Questions, RoutingExpression} from "@/types/routing-expressions.ts";
import type {RoutingCondition, RoutingExpressionFormData} from "@/types/routing-expressions-create.ts";

{/* Helper function to extract possible answers from question.meta */}
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

{/* Helper function to convert a condition to expression code (DISTRICT IS STILL HARDCODED) */}
export function convertConditionToExpression(condition: RoutingCondition): string {
    switch (condition.type) {
        case "category":
            return `sub == "${condition.categories}"`

        case "area":
            return `location in areas."district"."${condition.areas}"`

        case "question":
            return `${condition.questions}`

        default:
            return ""
    }
}

{/* Helper function to convert form conditions to expression code */}
export function convertConditionsToExpression(
    conditions: RoutingCondition[]
): string {
    return conditions
        .map(convertConditionToExpression)
        .filter(Boolean)
        .join(" and ")
}

{/* Helper function to create an Expression from form data */}
export function createExpressionFromFormData(formData: RoutingExpressionFormData): Expression {
    return {
        name: formData.name,
        code: convertConditionsToExpression(formData.conditions),
        _type: "routing",
    }
}

{/* Helper function to create a RoutingExpression from form data */}
export function createRoutingExpressionFromFormData(formData: RoutingExpressionFormData): RoutingExpression {
    return {
        _expression: formData.name,
        _department: formData.department,
        _user: "",
        order: String(formData.order),
        is_active: formData.isActive ? "1" : "0",
    }
}

{/* Helper function to convert routing expression form data */}
export function convertRoutingExpressionFormData(
    formData: RoutingExpressionFormData
) {
    return {
        expression: createExpressionFromFormData(formData),
        routingExpression:
            createRoutingExpressionFromFormData(formData),
    }
}