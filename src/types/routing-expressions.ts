export type RoutingExpression = {
    _expression: string
    _department: string
    _user: string
    order: string
    is_active: string
}

export type Expression = {
    "name": string,
    "code": string,
    "_type": string
}

export type Department = {
    "code": string,
    "name": string,
    "is_intern": string,
    "can_direct": string,
    "categories": string
}

export type Area = {
    "name": string,
    "code": string,
    "_type": string,
    "geometry": string,
}