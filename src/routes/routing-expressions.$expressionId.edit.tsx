import { createFileRoute } from '@tanstack/react-router'
import {RoutingExpressionsEditPage} from "@/routes/-components/routing-expressions-edit-page.tsx";

export const Route = createFileRoute('/routing-expressions/$expressionId/edit')(
  {
      staticData: {
          breadcrumb: {
              label: "Bewerken",
          },
      },
    component: RoutingExpressionsEditPage
  }
)
