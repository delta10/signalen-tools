import type { Expression } from "@/types/domain/routing.ts"
import type {Area, Question,} from "@/types/domain/reference-data.ts"
import type { RoutingExpressionTableRow } from "@/types/view-models/table.ts"
import {extractCategories, getExpressionAreaNames, getExpressionQuestionsAnswers, getExpressionTypes,} from "@/utils/routing-expressions.ts"

export function mapExpressionsToTableRows(
    expressions: Expression[],
    areas: Area[],
    questions: Question[]
): RoutingExpressionTableRow[] {
    return expressions.map((expression) => ({
        order: String(expression.routing?.order ?? ""),
        name: expression.name,
        types: getExpressionTypes(expression),
        categories: extractCategories(expression.code),
        areas: getExpressionAreaNames(expression, areas),
        questionAnswers: getExpressionQuestionsAnswers(expression, questions),
        department: expression.routing?.department.name ?? "-",
        isActive: expression.isActive,
    }))
}