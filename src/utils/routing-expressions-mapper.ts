import type { Expression } from "@/types/domain/routing"
import type {Area, Question,} from "@/types/domain/reference-data"
import type { RoutingExpressionTableRow } from "@/types/view-models/table"
import {getExpressionAreaNames, getExpressionCategories, getExpressionQuestionsAnswers, getExpressionTypes,} from "@/utils/routing-expressions"

export function mapExpressionsToTableRows(
    expressions: Expression[],
    areas: Area[],
    questions: Question[]
): RoutingExpressionTableRow[] {
    return expressions.map((expression) => ({
        order: String(expression.routing?.order ?? ""),
        name: expression.name,
        types: getExpressionTypes(expression),
        categories: getExpressionCategories(expression),
        areas: getExpressionAreaNames(expression, areas),
        questionAnswers: getExpressionQuestionsAnswers(expression, questions),
        department: expression.routing?.department.name ?? "-",
        isActive: expression.isActive,
    }))
}