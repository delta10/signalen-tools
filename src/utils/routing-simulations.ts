import type {Area, Expression, Questions, RoutingExpression} from "@/types/routing-expressions.ts";
import {getRoutingExpressionAreas, getRoutingExpressionCategories, getRoutingExpressionQuestionConditions} from "@/utils/routing-expressions.ts";
import type {Category} from "@/types/routing-expressions-create.ts";
import type {RoutingSimulationData, SimulationResult} from "@/types/routing-simulations.ts";

{/* Generic helper function to check if anything matches */}
function matchesAny<T>(conditions: T[], predicate: (condition: T) => boolean,): boolean {
    if (conditions.length === 0) {
        return true
    }

    return conditions.some(predicate)
}

{/* Helper function to split categories from specific question */}
export function getQuestionCategorySlugs(question: Questions): string[] {
    if (!question.categories) {
        return []
    }

    return question.categories
        .split(",")
        .map((category) => category.trim().split("|")[0])
}

{/* Helper function to match category with simulated signal */}
export function doesCategoryMatch(
    simulationData: RoutingSimulationData,
    routingExpression: RoutingExpression,
    expressions: Expression[],
    categories: Category[],
): boolean {
    const expressionCategories = getRoutingExpressionCategories(
        routingExpression,
        expressions
    )

    const selectedCategory = categories.find(
        (category) => category.slug === simulationData.category
    )

    return matchesAny(
        expressionCategories,
        (category) => category === selectedCategory?.slug
    )
}

{/* Helper function to match area with simulated signal */}
export function doesAreaMatch(
    simulationData: RoutingSimulationData,
    routingExpression: RoutingExpression,
    expressions: Expression[],
    areas: Area[],
): boolean {
    const expressionAreas = getRoutingExpressionAreas(
        routingExpression,
        expressions
    )

    const selectedArea = areas.find(
        (area) => area.name === simulationData.area
    )

    return matchesAny(
        expressionAreas,
        (area) => area.code === selectedArea?.name
    )
}

{/* Helper function to match question/answer with simulated signal */}
export function doesQuestionAnswerMatch(
    simulationData: RoutingSimulationData,
    routingExpression: RoutingExpression,
    expressions: Expression[],
    questions: Questions[],
): boolean {
    const questionConditions = getRoutingExpressionQuestionConditions(
        routingExpression,
        expressions,
        questions
    )

    return matchesAny(
        questionConditions,
        (condition) =>
            condition.key === simulationData.question &&
            condition.value === simulationData.answer
    )
}

{/* Helper function to check all matches with simulated signal */}
export function simulateRouting(
    simulationData: RoutingSimulationData,
    routingExpressions: RoutingExpression[],
    expressions: Expression[],
    categories: Category[],
    areas: Area[],
    questions: Questions[],
    localRoutingExpressions: RoutingExpression[],
    localExpressions: Expression[],
) {
    const allRoutingExpressions = [
        ...routingExpressions,
        ...localRoutingExpressions,
    ]

    const allExpressions = [
        ...expressions,
        ...localExpressions,
    ]

    return allRoutingExpressions.map((routingExpression) => {
        const categoryMatches = doesCategoryMatch(
            simulationData,
            routingExpression,
            allExpressions,
            categories
        )

        const areaMatches = doesAreaMatch(
            simulationData,
            routingExpression,
            allExpressions,
            areas
        )

        const questionAnswerMatches = doesQuestionAnswerMatch(
            simulationData,
            routingExpression,
            allExpressions,
            questions
        )

        return {
            routingExpression,
            order: Number(routingExpression.order),
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

{/* Helper function that determines which routing is chosen based off order number */}
export function getSelectedRoutingExpression(results: SimulationResult[]): SimulationResult | null {
    const matches = results.filter((result) => result.matches)

    if (matches.length === 0) {
        return null
    }

    return matches.reduce((selected, current) =>
        current.order < selected.order ? current : selected
    )
}