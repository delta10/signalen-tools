import { createFileRoute } from '@tanstack/react-router'
import {RoutingExpressionsSimulationPage} from "@/routes/-components/routing-expressions-simulation-page.tsx";

export const Route = createFileRoute('/routing-expressions/simulate')({
    staticData: {
        breadcrumb: {
            label: "Simulatie",
            to: "/routing-expressions/simulate",
        },
    },
  component: RoutingExpressionsSimulationPage,
})
