import {SimulationForm} from "@/components/routing-simulation/simulation-form.tsx";
import {useState} from "react";
import {RoutingSimulationFlow} from "@/components/routing-simulation/simulation-flow.tsx";
import type {RoutingSimulationFormData, SimulationResult} from "@/types/routing-simulations.ts";

export function RoutingExpressionsSimulationPage() {
    const [simulationData, setSimulationData] = useState<RoutingSimulationFormData | null>(null)
    const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([])
    const [selectedRoutingExpression, setSelectedRoutingExpression] = useState<SimulationResult | null>(null)

    return(
        <div className={"grid min-h-full grid-cols-3 gap-8"}>
            <section className={"col-span-2 min-w-0 bg-muted rounded-lg"}>
                {simulationData && simulationResults.length > 0 && (
                    <RoutingSimulationFlow report={simulationData} results={simulationResults} selectedRoutingExpression={selectedRoutingExpression}/>
                )}
            </section>
            <section className={"col-span-1 min-w-0 h-full"}>
                <SimulationForm onSimulationComplete={(data, results, selected) => {
                    setSimulationData(data)
                    setSimulationResults(results)
                    setSelectedRoutingExpression(selected)
                }} />
            </section>
        </div>
    )
}