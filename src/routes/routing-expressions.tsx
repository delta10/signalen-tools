import { createFileRoute } from '@tanstack/react-router'
import {RoutingExpressionsPage} from "@/routes/-components/routing-expressions-page.tsx";

export const Route = createFileRoute('/routing-expressions')({
  component: RoutingExpressionsPage,
})
