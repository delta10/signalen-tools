import type { Category } from "@/types/domain/reference-data"
import type { Expression } from "@/types/domain/routing"
import type {RoutingSimulationData, SimulationResult,} from "@/types/routing-simulations"
import { evaluateRoutingExpression } from "@/utils/evaluate-routing-expression"

/* Simulate routing for all active expressions */
export function simulateRouting(
    simulationData: RoutingSimulationData,
    expressions: Expression[],
    categories: Category[],
): SimulationResult[] {
    return expressions
        .filter(
            (expression) =>
                expression.routing !== null &&
                expression.isActive
        )
        .map((expression) => {
            let matches = false

            try {
                matches = evaluateRoutingExpression(
                    expression.code,
                    {
                        simulation: simulationData,
                        categories,
                    }
                )
            } catch (error) {
                console.error(
                    `Cannot evaluate expression: ${expression.name}`,
                    error
                )
            }

            return {
                expression,
                order: expression.routing!.order,
                matches,
            }
        })
}

/* Select matching expression with highest priority (lowest order) */
export function getSelectedRoutingExpression(results: SimulationResult[],): SimulationResult | null {
    const matches = results.filter((result) => result.matches)

    if (matches.length === 0) {
        return null
    }

    return matches.reduce((selected, current) =>
        current.order < selected.order ? current : selected
    )
}