import type {Area, Expression, Questions, RoutingExpression} from "@/types/routing-expressions.ts";
import {
    getRoutingExpressionAreas,
    getRoutingExpressionCategories,
    getRoutingExpressionQuestionConditions
} from "@/utils/routing-expressions.ts";
import type {Category} from "@/types/routing-expressions-create.ts";
import type {RoutingSimulationData} from "@/types/routing-simulations.ts";

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

    if (expressionCategories.length === 0) {
        return true
    }

    const selectedCategory = categories.find(
        (category) => category.slug === simulationData.category
    )

    if (!selectedCategory) {
        return false
    }

    return expressionCategories.includes(selectedCategory.name)
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

    if (expressionAreas.length === 0) {
        return true
    }

    const selectedArea = areas.find(
        (area) => area.name === simulationData.area
    )

    if (!selectedArea) {
        return false
    }

    return expressionAreas.some(
        (area) => area.code === selectedArea.code
    )
}

{/* Helper function to match question/answer with simulated signal */}
export function doesQuestionAnswerMatch(
    simulationData: RoutingSimulationData,
    routingExpression: RoutingExpression,
    expressions: Expression[],
    questions: Questions[],
): boolean {
    const questionConditions = getRoutingExpressionQuestionConditions(routingExpression, expressions, questions)

    if (questionConditions.length === 0) {
        return true
    }

    if (!simulationData.question || !simulationData.answer) {
        return false
    }

    return questionConditions.some(
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