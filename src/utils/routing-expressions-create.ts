import type {Expression, Questions, RoutingExpression,} from "@/types/routing-expressions.ts"
import type {
    ConditionType,
    RoutingConditionGroup,
    RoutingExpressionFormData,
} from "@/types/routing-expressions-create.ts"


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

/* Helper function to create array of category slugs */
export function getQuestionCategorySlugs(question: Questions): string[] {
    if (!question.categories) {
        return []
    }

    return question.categories
        .split(",")
        .map((category) => category.trim().split("|")[0])
}


/* Convert one condition value to expression code based on its group type */
export function convertConditionValueToExpression(type: ConditionType, value: string,): string {
    switch (type) {
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
    if (group.type === "question") {
        if (!group.question || !group.answer) {
            return ""
        }

        return `(${group.question} == "${group.answer}")`
    }

    const separator =
        group.operator === "AND"
            ? " and "
            : " or "

    const expressions = group.values
        .filter(Boolean)
        .map((value) =>
            convertConditionValueToExpression(group.type, value)
        )

    if (expressions.length === 0) {
        return ""
    }

    return `(${expressions.join(separator)})`
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