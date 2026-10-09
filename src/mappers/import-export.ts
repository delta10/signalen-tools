import type {
    AreaTransfer, CategoryTransfer,
    DepartmentTransfer,
    ExpressionTransfer, QuestionsTransfer,
    RoutingExpressionTransfer,
} from "@/types/import-export/expressions"
import type { Expression } from "@/types/domain/routing"
import type {Area, Category, Department, Question} from "@/types/domain/reference-data"

export function mapTransfersToDomain(
    routingExpressions: RoutingExpressionTransfer[],
    expressions: ExpressionTransfer[],
    departments: Department[]
): Expression[] {
    return routingExpressions
        .map<Expression | null>((routingExpression, index) => {
            const expression = expressions.find(
                (expression) =>
                    expression.name === routingExpression._expression
            )

            if (!expression) {
                return null
            }

            const department = departments.find(
                (department) =>
                    department.code === routingExpression._department
            )

            return {
                id: index + 1,
                name: expression.name,
                code: expression.code,
                type: expression._type,
                isActive: routingExpression.is_active === "1",
                routing: {
                    department: department ?? {
                        id: 0,
                        code: routingExpression._department,
                        name: routingExpression._department,
                        isIntern: false,
                    },
                    order: Number(routingExpression.order),
                },
            }
        })
        .filter(
            (expression): expression is Expression =>
                expression !== null
        )
}

export function mapDepartmentTransfersToDomain(departments: DepartmentTransfer[]): Department[] {
    return departments.map((department, index) => ({
        id: index,
        code: department.code,
        name: department.name,
        isIntern: department.is_intern === "1",
    }))
}

export function mapAreaTransfersToDomain(areas: AreaTransfer[]): Area[] {
    return areas.map((area, index) => ({
        id: index,
        code: area.code,
        name: area.name,
        type: {
            id: 0,
            code: area._type,
            name: area._type,
        },
    }))
}

export function mapQuestionTransfersToDomain(questions: QuestionsTransfer[]): Question[] {
    return questions.map((question, index) => {
        const meta = JSON.parse(question.meta) as {
            label?: string
            values?: Record<string, string>
        }

        return {
            id: index,
            key: question.key,
            label: meta.label ?? question.key,
            fieldType: question.field_type,
            required: question.required === "1",
            answers: Object.entries(meta.values ?? {}).map(
                ([value, label]) => ({
                    value,
                    label,
                })
            ),
            categorySlugs: question.categories
                .split(",")
                .map((category) => category.trim().split("|")[0])
                .filter(Boolean),
        }
    })
}

export function mapCategoryTransfersToDomain(categories: CategoryTransfer[]): Category[] {
    return categories.map((category, index) => ({
        id: index,
        slug: category.slug,
        name: category.name,
    }))
}