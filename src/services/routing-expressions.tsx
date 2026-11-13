import routingExpressions from "@/data/RoutingExpression-2026-09-08.json"
import type {RoutingExpressionTransfer} from "@/types/import-export/expressions.ts";

export async function getRoutingExpressions(): Promise<RoutingExpressionTransfer[]> {
    const newRoutingExpressions: RoutingExpressionTransfer[] =
        JSON.parse(
            localStorage.getItem("newRoutingExpressions") ?? "[]"
        )

    return [
        ...routingExpressions,
        ...newRoutingExpressions,
    ]
}