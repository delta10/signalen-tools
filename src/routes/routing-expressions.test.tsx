import { createFileRoute } from '@tanstack/react-router'
import {RoutingExpressionsTestPage} from "@/routes/-components/routing-expressions-test-page.tsx";

export const Route = createFileRoute('/routing-expressions/test')({
    staticData: {
        breadcrumb: {
            label: "Testen",
            to: "/routing-expressions/test",
        },
    },
  component: RoutingExpressionsTestPage,
})
