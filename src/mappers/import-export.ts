import type {
    AreaTransfer, CategoryTransfer,
    DepartmentTransfer,
    ExpressionTransfer, QuestionsTransfer,
    RoutingExpressionTransfer,
} from "@/types/import-export/expressions"
import type { Expression } from "@/types/domain/routing"
import type {Area, Category, Department, Question} from "@/types/domain/reference-data"
import {mapCategorySlugsToIds, parseQuestionCategorySlugs} from "@/mappers/question-categories.ts";
import { isSupportedQuestionType, getAmbiguousCategorySlugs } from "@/utils/questions"

/* Import: Transfer models → Domain models */
export function mapTransfersToDomain(
    routingExpressions: RoutingExpressionTransfer[],
    expressions: ExpressionTransfer[],
    departments: Department[]
): Expression[] {
    return routingExpressions
        .map<Expression | null>((routingExpression) => {
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
                id: crypto.randomUUID(),
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
                    user: routingExpression._user || null,
                },
            }
        })
        .filter(
            (expression): expression is Expression =>
                expression !== null
        )
}

/* Export: Domain models → Transfer models */
export function mapDomainToTransfers(expressions: Expression[]): {
    expressions: ExpressionTransfer[]
    routingExpressions: RoutingExpressionTransfer[]
} {
    return {
        expressions: expressions.map((expression) => ({
            name: expression.name,
            code: expression.code,
            _type: expression.type,
        })),

        routingExpressions: expressions
            .filter((expression) => expression.routing !== null)
            .map((expression) => ({
                _expression: expression.name,
                _department: expression.routing!.department.code,
                _user: expression.routing!.user ?? "",
                order: String(expression.routing!.order),
                is_active: expression.isActive ? "1" : "0",
            })),
    }
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

export function mapQuestionTransfersToDomain(questions: QuestionsTransfer[], categories: Category[]): Question[] {
    const keys = new Set<string>()

    return questions.map((question, index) => {
        if (keys.has(question.key)) {
            throw new Error(
                `Dubbele vraag-key "${question.key}" in importbestand.`
            )
        }

        keys.add(question.key)

        const parsed: unknown = JSON.parse(question.meta)

        if (
            typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed)
        ) {
            throw new Error(
                `Ongeldige metadata bij vraag "${question.key}".`
            )
        }

        const meta = parsed as {
            label?: string
            values?: Record<string, string>
        }

        const supported = isSupportedQuestionType(question.field_type)

        return {
            id: index,
            key: question.key,
            label: meta.label ?? question.key,
            fieldType: question.field_type,
            required: question.required === "1",
            answers: Object.entries(meta.values ?? {}).map(
                ([value, label]) => ({ value, label })
            ),
            categoryIds: supported
                ? mapCategorySlugsToIds(parseQuestionCategorySlugs(question.categories), categories)
                : [],
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


export function mapQuestionDomainToTransfers(questions: Question[], categories: Category[], originalQuestions: QuestionsTransfer[]): QuestionsTransfer[] {
    const categoryById = new Map(
        categories.map(category => [category.id, category])
    )

    const ambiguousSlugs = getAmbiguousCategorySlugs(categories)

    return questions.map(question => {
        const original = originalQuestions[question.id]

        // Niet-ondersteunde vraagtypes exact behouden
        if (!isSupportedQuestionType(question.fieldType)) {
            if (!original) {
                throw new Error(
                    `Geen originele gegevens gevonden voor "${question.key}".`
                )
            }

            return { ...original }
        }

        // Ontbrekende data niet exporteren
        if (!Array.isArray(question.categoryIds)) {
            throw new Error(
                `Vraag "${question.key}" heeft geen geldige categoryIds.`
            )
        }

        const slugs = question.categoryIds.map(id => {
            const category = categoryById.get(id)

            if (!category) {
                throw new Error(
                    `Categorie-ID ${id} bij vraag "${question.key}" bestaat niet.`
                )
            }

            return category.slug
        })

        const hasDuplicateSlugs = slugs.some(slug =>
            ambiguousSlugs.has(slug)
        )

        const originalSlugs = original
            ? parseQuestionCategorySlugs(original.categories)
            : []

        const unchangedCategories =
            original !== undefined &&
            originalSlugs.length === slugs.length &&
            originalSlugs.every((slug, i) => slug === slugs[i])

        if (hasDuplicateSlugs && !unchangedCategories) {
            throw new Error(
                `Vraag "${question.key}" bevat een niet-unieke categorie-slug.`
            )
        }

        const categoriesValue = unchangedCategories
            ? original.categories
            : slugs.join(",")

        // Bewaar onbekende metadata bij bestaande vragen
        let originalMeta: Record<string, unknown> = {}

        if (original) {
            const parsed: unknown = JSON.parse(original.meta)

            if (
                typeof parsed !== "object" ||
                parsed === null ||
                Array.isArray(parsed)
            ) {
                throw new Error(
                    `Ongeldige metadata bij vraag "${question.key}".`
                )
            }

            originalMeta = parsed as Record<string, unknown>
        }

        return {
            key: question.key,
            field_type: question.fieldType,
            required: question.required ? "1" : "0",
            categories: categoriesValue,
            meta: JSON.stringify({
                ...originalMeta,
                label: question.label,
                values: Object.fromEntries(
                    question.answers.map(answer => [
                        answer.value,
                        answer.label,
                    ])
                ),
            }),
        }
    })
}