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
    type: FormConditionType
    categories: string
    areas: string
    questions: string
    answers: string[]
    operator?: "AND" | "OR"
}

export type RoutingExpressionFormData = {
    name: string
    order: number
    isActive: boolean
    conditions: RoutingCondition[]
    department: string
}

export type ConditionType = "category" | "area" | "question"
export type FormConditionType = ConditionType | ""