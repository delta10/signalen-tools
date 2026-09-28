export type Category = {
    parent: string,
    slug: string,
    name: string,
    public_name: string,
    is_public_accessible: string,
    configuration: string | null,
    handling: string,
    handling_message: string,
    is_active: string,
    description: string,
    note: string,
    icon: string
}

export type RoutingCondition = {
    id: string
    value: string
}

export type RoutingConditionGroup = {
    id: string
    type: ConditionType
    operator: ConditionOperator
    conditions: RoutingCondition[]
}

export type RoutingExpressionFormData = {
    name: string
    order: number
    isActive: boolean
    conditionOperator: ConditionOperator
    conditionGroups: RoutingConditionGroup[]
    department: string
}

export type ConditionType = "category" | "area" | "question"
export type ConditionOperator = "AND" | "OR"