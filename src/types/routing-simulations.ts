import type {RoutingExpression} from "@/types/routing-expressions.ts";

export type RoutingSimulationFormData = {
    category: string
    area: string
    question: string
    answer: string
}

export type RoutingSimulationData = {
    category: string
    area: string
    question: string
    answer: string
}

export type SimulationFormProps = {
    onSimulationComplete: (
        data: RoutingSimulationFormData,
        results: SimulationResult[],
        selected: SimulationResult | null
    ) => void
}

export type SimulationResult = {
    routingExpression: RoutingExpression
    order: number
    matches: boolean
    checks: {
        category: boolean
        area: boolean
        questionAnswer: boolean
    }
}