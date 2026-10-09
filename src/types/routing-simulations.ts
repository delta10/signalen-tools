import type { Expression } from "@/types/domain/routing"

export type RoutingSimulationFormData = {
    category: string
    area: string
    question: string
    answer: string
}

export type RoutingSimulationData = RoutingSimulationFormData

export type SimulationFormProps = {
    onSimulationComplete: (
        data: RoutingSimulationFormData,
        results: SimulationResult[],
        selected: SimulationResult | null
    ) => void
}

export type SimulationResult = {
    expression: Expression
    order: number
    matches: boolean
    checks: {
        category: boolean
        area: boolean
        questionAnswer: boolean
    }
}