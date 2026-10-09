import type { Area, Category, Question } from "@/types/domain/reference-data"
import type { Expression } from "@/types/domain/routing"
import type {RoutingSimulationData, SimulationResult,} from "@/types/routing-simulations"
import {extractCategories, getExpressionAreas, getExpressionQuestionConditions,} from "@/utils/routing-expressions"

/* Generic helper function to check if anything matches */
function matchesAny<T>(
    conditions: T[],
    predicate: (condition: T) => boolean,
): boolean {
    if (conditions.length === 0) {
        return true
    }

    return conditions.some(predicate)
}

/* Match category with simulated signal */
export function doesCategoryMatch(
    simulationData: RoutingSimulationData,
    expression: Expression,
    categories: Category[],
): boolean {
    const expressionCategories = extractCategories(expression.code)

    const selectedCategory = categories.find(
        (category) => category.slug === simulationData.category
    )

    return matchesAny(
        expressionCategories,
        (category) => category === selectedCategory?.name
    )
}

/* Match area with simulated signal */
export function doesAreaMatch(
    simulationData: RoutingSimulationData,
    expression: Expression,
    areas: Area[],
): boolean {
    const expressionAreas = getExpressionAreas(expression)

    const selectedArea = areas.find(
        (area) => area.code === simulationData.area
    )

    return matchesAny(
        expressionAreas,
        (area) => area.code === selectedArea?.code
    )
}

/* Match question and answer with simulated signal */
export function doesQuestionAnswerMatch(
    simulationData: RoutingSimulationData,
    expression: Expression,
    questions: Question[],
): boolean {
    const questionConditions = getExpressionQuestionConditions(
        expression,
        questions
    )

    return matchesAny(
        questionConditions,
        (condition) =>
            condition.key === simulationData.question &&
            condition.value === simulationData.answer
    )
}

/* Simulate routing for all expressions */
export function simulateRouting(
    simulationData: RoutingSimulationData,
    expressions: Expression[],
    categories: Category[],
    areas: Area[],
    questions: Question[],
): SimulationResult[] {
    return expressions
        .filter((expression) => expression.routing !== null)
        .map((expression) => {
            const categoryMatches = doesCategoryMatch(
                simulationData,
                expression,
                categories
            )

            const areaMatches = doesAreaMatch(
                simulationData,
                expression,
                areas
            )

            const questionAnswerMatches = doesQuestionAnswerMatch(
                simulationData,
                expression,
                questions
            )

            return {
                expression,
                order: expression.routing!.order,
                matches:
                    categoryMatches &&
                    areaMatches &&
                    questionAnswerMatches,
                checks: {
                    category: categoryMatches,
                    area: areaMatches,
                    questionAnswer: questionAnswerMatches,
                },
            }
        })
}

/* Select matching expression with highest priority (lowest order) */
export function getSelectedRoutingExpression(
    results: SimulationResult[],
): SimulationResult | null {
    const matches = results.filter((result) => result.matches)

    if (matches.length === 0) {
        return null
    }

    return matches.reduce((selected, current) =>
        current.order < selected.order ? current : selected
    )
}