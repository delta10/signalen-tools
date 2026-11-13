import type {ConditionType, RoutingConditionGroup} from "@/types/forms/create-expression.ts"
import type {Category, Question} from "@/types/domain/reference-data.ts";

/* Helper function to identify radio & checkbox input questions */
export function isSupportedQuestion(question: Question): boolean {
    return (
        question.fieldType === "radio_input" ||
        question.fieldType === "checkbox_input"
    )
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
export function convertConditionGroupToExpression(group: RoutingConditionGroup, categories: Category[]): string {
    if (group.type === "question") {
        if (!group.question || !group.answer) {
            return ""
        }

        return `(${group.question} == "${group.answer}")`
    }
    if (group.type === "category") {
        return group.values
            .map((slug) => {
                const category = categories.find(
                    (category) => category.slug === slug
                )

                return `sub == "${category?.name ?? slug}"`
            })
            .join(` ${group.operator.toLowerCase()} `)
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