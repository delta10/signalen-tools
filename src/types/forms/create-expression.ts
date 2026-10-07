export type RoutingCondition = {
    id: string
    value: string
}

export type RoutingConditionGroup = {
    id: string
    type: ConditionType
    operator: ConditionOperator
    conditions: RoutingCondition[]
    values: string[]
    question: string
    answer: string
}

export type RoutingExpressionFormData = {
    name: string
    order: number
    isActive: boolean
    conditionOperator: ConditionOperator
    conditionGroups: RoutingConditionGroup[]
    department: string
}

export const ConditionTypes = {
    CATEGORY: "category",
    AREA: "area",
    QUESTION: "question",
} as const

export type ConditionType =
    typeof ConditionTypes[keyof typeof ConditionTypes]

export type FormConditionType = ConditionType | ""

export const ConditionOperators = {
    AND: "AND",
    OR: "OR",
} as const

export type ConditionOperator =
    typeof ConditionOperators[keyof typeof ConditionOperators]