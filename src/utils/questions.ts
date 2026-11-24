import type { Category, Question } from "@/types/domain/reference-data"
import type { Expression } from "@/types/domain/routing"
import { extractQuestionReferences, extractCategories } from "@/utils/routing-expressions"

export const SUPPORTED_QUESTION_TYPES = [
    "radio_input",
    "checkbox_input",
] as const

export type SupportedQuestionType = typeof SUPPORTED_QUESTION_TYPES[number]

const RESERVED_QUESTION_KEYS = new Set(["sub", "location", "areas", "and", "or", "in", "not", "true", "false"])

export function isSupportedQuestionType(type: string): type is SupportedQuestionType {
    return SUPPORTED_QUESTION_TYPES.some(
        supportedType => supportedType === type
    )
}

export function isSupportedQuestion(
    question: Question
): question is Question & {
    fieldType: SupportedQuestionType
} {
    return isSupportedQuestionType(question.fieldType)
}

export function getQuestionsForCategories(questions: Question[], categories: Category[], selectedSlugs: string[]): Question[] {
    const selectedCategoryIds = new Set(
        categories
            .filter(category => selectedSlugs.includes(category.slug))
            .map(category => category.id)
    )

    return questions
        .filter(isSupportedQuestion)
        .filter(question =>
            question.categoryIds.some(id =>
                selectedCategoryIds.has(id)
            )
        )
}

export function validateQuestionKey(key: string): string | null {
    if (!key.trim()) {
        return "Vul een key in."
    }

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
        return (
            "De key moet beginnen met een letter of underscore " +
            "en mag alleen letters, cijfers en underscores bevatten."
        )
    }

    if (RESERVED_QUESTION_KEYS.has(key.toLowerCase())) {
        return `"${key}" is een gereserveerde key. Kies een andere key.`
    }

    return null
}

export function getExpressionsUsingQuestion(questionKey: string, expressions: Expression[], answerValue?: string): Expression[] {
    return expressions.filter(expression =>
        extractQuestionReferences(expression.code).some(
            reference =>
                reference.key === questionKey &&
                (
                    answerValue === undefined ||
                    reference.value === answerValue
                )
        )
    )
}

export function getExpressionsAffectedByAnswerChanges(
    originalQuestion: Pick<Question, "key" | "answers">,
    updatedAnswers: Question["answers"],
    expressions: Expression[]
): Expression[] {
    const changedAnswers = originalQuestion.answers.filter(
        originalAnswer => {
            const updatedAnswer = updatedAnswers.find(
                answer => answer.value === originalAnswer.value
            )

            return (
                !updatedAnswer ||
                updatedAnswer.label.trim() !== originalAnswer.label.trim()
            )
        }
    )

    const affectedExpressions = changedAnswers.flatMap(answer =>
        getExpressionsUsingQuestion(
            originalQuestion.key,
            expressions,
            answer.value
        )
    )

    return [...new Map(
        affectedExpressions.map(expression => [
            expression.id,
            expression,
        ])
    ).values()]
}

export function getExpressionsAffectedByCategoryChanges(
    originalQuestion: Pick<Question, "key" | "categoryIds">,
    updatedCategoryIds: number[],
    categories: Category[],
    expressions: Expression[]
): Expression[] {
    const removedCategoryIds = originalQuestion.categoryIds.filter(
        id => !updatedCategoryIds.includes(id)
    )

    if (removedCategoryIds.length === 0) {
        return []
    }

    const removedCategoryNames = categories
        .filter(category => removedCategoryIds.includes(category.id))
        .map(category => category.name)

    return getExpressionsUsingQuestion(
        originalQuestion.key,
        expressions
    ).filter(expression => {
        const expressionCategories = extractCategories(expression.code)

        return (
            expressionCategories.length === 0 ||
            expressionCategories.some(category =>
                removedCategoryNames.includes(category)
            )
        )
    })
}

export function getNextAnswerValue(answers: Question["answers"], storedNextValue?: number): number {
    return Math.max(
        1,
        storedNextValue ?? 1,
        ...answers.map(answer => {
            const value = Number(answer.value)

            return Number.isSafeInteger(value) && value >= 0
                ? value + 1
                : 1
        })
    )
}

export function getAmbiguousCategorySlugs(categories: Category[]): Set<string> {
    const seen = new Set<string>()
    const duplicates = new Set<string>()

    for (const category of categories) {
        if (seen.has(category.slug)) {
            duplicates.add(category.slug)
        }

        seen.add(category.slug)
    }

    return duplicates
}

export function validateQuestionReferences(expressions: Expression[], questions: Question[]): string[] {
    const warnings = new Set<string>()

    const questionsByKey = new Map(
        questions.map(question => [question.key, question])
    )

    for (const expression of expressions) {
        const references = extractQuestionReferences(expression.code)

        for (const reference of references) {
            const question = questionsByKey.get(reference.key)

            if (!question) {
                warnings.add(
                    `"${expression.name}": vraag "${reference.key}" bestaat niet.`
                )

                continue
            }

            if (!isSupportedQuestion(question)) {
                continue
            }

            const answerExists = question.answers.some(
                answer => answer.value === reference.value
            )

            if (!answerExists) {
                warnings.add(
                    `"${expression.name}": antwoordwaarde "${reference.value}" ` +
                    `bestaat niet bij vraag "${reference.key}".`
                )
            }
        }
    }

    return [...warnings]
}