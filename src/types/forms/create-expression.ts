export type ConditionsFormValue = {
    combinator: string
    rules: unknown[]
}

export type CategoryCondition = {
    category: string
    question: string
    answer: string
}

export type CategoryRuleValue = {
    categories: CategoryCondition[]
}

export type RoutingExpressionFormData = {
    name: string
    order: number
    isActive: boolean
    department: string
    conditions: ConditionsFormValue
}