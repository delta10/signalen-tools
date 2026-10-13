import type {Department} from "@/types/domain/reference-data.ts";

export type Expression = {
    id: string
    name: string
    code: string
    type: string
    isActive: boolean
    routing: ExpressionRouting | null
}

export type ExpressionRouting = {
    department: Department
    order: number
}