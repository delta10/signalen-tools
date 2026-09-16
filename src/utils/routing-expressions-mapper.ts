import type {
    Area,
    Department,
    Expression, Questions,
    RoutingExpression,
    RoutingExpressionTableRow
} from "@/types/routing-expressions.ts";
import {getDepartmentName, getRoutingExpressionAreaNames, getRoutingExpressionCategories, getRoutingExpressionQuestionsAnswers, getRoutingExpressionTypes} from "@/utils/routing-expressions.ts";

export function mapRoutingExpressionsToTableRows(
    routingExpressions: RoutingExpression[],
    expressions: Expression[],
    areas: Area[],
    questions: Questions[],
    departments: Department[]
): RoutingExpressionTableRow[] {
    return routingExpressions.map(
        (routingExpression) => ({
            order: routingExpression.order,
            name: routingExpression._expression,
            types: getRoutingExpressionTypes(
                routingExpression,
                expressions
            ),
            categories: getRoutingExpressionCategories(
                routingExpression,
                expressions
            ),
            areas: getRoutingExpressionAreaNames(
                routingExpression,
                expressions,
                areas
            ),
            questionAnswers: getRoutingExpressionQuestionsAnswers(
                routingExpression,
                expressions,
                questions
            ),
            department: getDepartmentName(
                routingExpression._department,
                departments
            ),
            isActive: routingExpression.is_active === "1",
        })
    )
}