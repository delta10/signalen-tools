import {SimulationForm} from "@/components/routing-simulation/simulation-form.tsx";
import {useState} from "react";

export function RoutingExpressionsSimulationPage() {
    const [simulationResults, setSimulationResults] = useState<any[]>([])

    return(
        <div className={"grid min-h-full grid-cols-3 gap-8"}>
            <section className={"col-span-2 min-w-0 bg-muted rounded-lg"}>
                {simulationResults.length === 0 ? (
                    <p>Nog geen simulatie uitgevoerd.</p>
                ) : (
                    <div className="mt-4 flex flex-col gap-4">
                        {simulationResults.map((result) => (
                            <div key={result.routingExpression._expression}>
                                <p>Expression:{" "} {result.routingExpression._expression}</p>
                                <p>Match: {result.matches ? "JA" : "NEE"}</p>
                                <p>Categorie:{" "} {result.checks.category ? "✓" : "✕"}</p>
                                <p>Gebied:{" "} {result.checks.area ? "✓" : "✕"}</p>
                                <p>Vraag/antwoord:{" "} {result.checks.questionAnswer ? "✓" : "✕"}</p>
                                <hr className="my-4" />
                            </div>
                        ))}
                    </div>
                )}
            </section>
            <section className={"col-span-1 min-w-0 h-full"}>
                <SimulationForm onSimulationComplete={(results) => {
                    setSimulationResults(results)
                }} />
            </section>
        </div>
    )
}