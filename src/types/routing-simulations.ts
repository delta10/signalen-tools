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
    onSimulationComplete: (results: any[]) => void
}