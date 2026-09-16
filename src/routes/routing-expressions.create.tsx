import { createFileRoute } from '@tanstack/react-router'
import {RoutingExpressionsCreatePage} from "@/routes/-components/routing-expressions-create-page.tsx";

export const Route = createFileRoute('/routing-expressions/create')({
  staticData: {
    breadcrumb: {
      label: "Toevoegen",
      to: "/routing-expressions/create",
    },
  },
  component: RoutingExpressionsCreatePage,
})
