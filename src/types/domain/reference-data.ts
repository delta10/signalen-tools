export type Category = {
    id: number
    slug: string
    name: string
}

export type Department = {
    id: number
    code: string
    name: string
    isIntern: boolean
}

export type Area = {
    id: number
    code: string
    name: string
    type: AreaType
}

export type AreaType = {
    id: number
    code: string
    name: string
}

export type Question = {
    id: number
    key: string
    label: string
    fieldType: string
    required: boolean
    answers: QuestionAnswer[]
    categorySlugs: string[]
}

export type QuestionAnswer = {
    value: string
    label: string
}

// Legacy type used by existing demo/simulation code.
// Remove after migration to domain Expression is complete.
export type RoutingExpression = {
    _expression: string
    _department: string
    _user: string
    order: string
    is_active: string
}