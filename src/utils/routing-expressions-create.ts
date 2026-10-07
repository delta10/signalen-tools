import type {ConditionType, RoutingConditionGroup, RoutingExpressionFormData,} from "@/types/forms/create-expression.ts"
import type {Question} from "@/types/domain/reference-data.ts";
import type {ExpressionTransfer, RoutingExpressionTransfer} from "@/types/import-export/expressions.ts";

/* Helper function to identify radio & checkbox input questions */
export function isSupportedQuestion(question: Question): boolean {
    return (
        question.fieldType === "radio_input" ||
        question.fieldType === "checkbox_input"
    )
}

/* Helper function to extract question label from metadata */
export function getQuestionLabel(question: Question): string {
    return question.label
}

/* Helper function to extract possible answers from question.meta */
export function getQuestionAnswers(question: Question): string[] {
    return question.answers.map((answer) => answer.label)
}

/* Helper function to create array of category slugs */
export function getQuestionCategorySlugs(question: Question): string[] {
    return question.categorySlugs
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
export function createExpressionFromFormData(formData: RoutingExpressionFormData): ExpressionTransfer {
    return {
        name: formData.name,
        code: convertConditionsToExpression(formData),
        _type: "routing",
    }
}


/* Helper function to create a RoutingExpression from form data */
export function createRoutingExpressionFromFormData(formData: RoutingExpressionFormData): RoutingExpressionTransfer {
    return {
        _expression: formData.name,
        _department: formData.department,
        _user: "",
        order: String(formData.order),
        is_active: formData.isActive ? "1" : "0",
    }
}

/* Helper function to convert routing expression form data */
export type CreateExpressionTransferResult = {
    expression: ExpressionTransfer
    routingExpression: RoutingExpressionTransfer
}

export function mapCreateExpressionFormToTransfers(formData: RoutingExpressionFormData): CreateExpressionTransferResult {
    return {
        expression: createExpressionFromFormData(formData),
        routingExpression:
            createRoutingExpressionFromFormData(formData),
    }
}