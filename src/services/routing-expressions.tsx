import routingExpressions from "@/data/RoutingExpression-2026-09-08.json"

{/* Can be fetched later */}
export type RoutingExpression = {
    _expression: string
    _department: string
    _user: string
    order: string
    is_active: string
}
export async function getRoutingExpressions(): Promise<RoutingExpression[]> {
    return routingExpressions
}