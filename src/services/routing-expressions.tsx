import routingExpressions from "@/data/RoutingExpression-2026-09-08.json"
import type {RoutingExpression} from "@/types/routing-expressions.ts";

{/* Endpoint(s) can eventually be fetched here */}
export async function getRoutingExpressions(): Promise<RoutingExpression[]> {
    {/* Only applicable to test environment */}
    const storedRoutingExpressions = JSON.parse(
        localStorage.getItem("newRoutingExpressions") ?? "[]"
    )

    return [
        ...routingExpressions,
        ...storedRoutingExpressions,
    ]
}