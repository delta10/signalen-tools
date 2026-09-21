import {SimulationForm} from "@/components/routing-simulation/simulation-form.tsx";

export function RoutingExpressionsSimulationPage() {
    return(
        <div className={"grid min-h-full grid-cols-3 gap-8"}>
            <section className={"col-span-2 min-w-0 bg-muted rounded-lg"}>

            </section>
            <section className={"col-span-1 min-w-0"}>
                <SimulationForm />
            </section>
        </div>
    )
}