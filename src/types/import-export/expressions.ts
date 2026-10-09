export type RoutingExpressionTransfer = {
    _expression: string
    _department: string
    _user: string
    order: string
    is_active: string
}

export type ExpressionTransfer = {
    "name": string,
    "code": string,
    "_type": string
}

export type DepartmentTransfer = {
    "code": string,
    "name": string,
    "is_intern": string,
    "can_direct": string,
    "categories": string
}

export type AreaTransfer = {
    "name": string,
    "code": string,
    "_type": string,
    "geometry": string,
}

export type QuestionsTransfer = {
    "key": string,
    "field_type": string,
    "meta": string,
    "required": string,
    "categories": string
}

export type CategoryTransfer = {
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