import {SimulationForm} from "@/components/routing-simulation/simulation-form.tsx";
import {useState} from "react";
import {RoutingSimulationFlow} from "@/components/routing-simulation/simulation-flow.tsx";
import type {RoutingSimulationFormData, SimulationResult} from "@/types/routing-simulations.ts";

export function RoutingExpressionsSimulationPage() {
    const [simulationData, setSimulationData] = useState<RoutingSimulationFormData | null>(null)
    const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([])
    const [selectedRoutingExpression, setSelectedRoutingExpression] = useState<SimulationResult | null>(null)

    return (
        <div className="grid min-h-full grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            <section className="order-2 min-w-0 min-h-100 rounded-lg bg-muted lg:order-1 lg:col-span-2">
                {simulationData && simulationResults.length > 0 && (
                    <RoutingSimulationFlow
                        report={simulationData}
                        results={simulationResults}
                        selectedRoutingExpression={selectedRoutingExpression}
                    />
                )}
            </section>
            <section className="order-1 min-w-0 lg:order-2 lg:col-span-1">
                <SimulationForm
                    onSimulationComplete={(data, results, selected) => {
                        setSimulationData(data)
                        setSimulationResults(results)
                        setSelectedRoutingExpression(selected)
                    }}
                />
            </section>
        </div>
    )
}