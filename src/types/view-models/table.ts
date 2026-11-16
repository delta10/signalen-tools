import type {RoutingType} from "@/utils/routing-expressions.ts";

export type RoutingExpressionTableRow = {
    id: string,
    order: string
    name: string
    types: RoutingType[]
    categories: string[]
    areas: string[]
    questionAnswers: string[]
    department: string
    isActive: boolean
}