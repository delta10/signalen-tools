import type { Category, Question } from "@/types/domain/reference-data"
import { mapCategorySlugsToIds } from "@/mappers/question-categories"

type LegacyQuestion = Omit<Question, "categoryIds"> & {
    categorySlugs: string[]
}

type StoredQuestion = Question | LegacyQuestion

const supportedTypes = ["radio_input", "checkbox_input"]

function isLegacyQuestion(question: StoredQuestion): question is LegacyQuestion {
    return !("categoryIds" in question)
        && "categorySlugs" in question
}

export function migrateQuestionCategories(
    questions: StoredQuestion[],
    categories: Category[]
): {
    questions: Question[]
    migrated: boolean
} {
    let migrated = false

    const updatedQuestions: Question[] = questions.map(question => {
        if (!isLegacyQuestion(question)) {
            return question
        }

        migrated = true

        if (!supportedTypes.includes(question.fieldType)) {
            return {
                ...question,
                categoryIds: [],
            }
        }

        const { categorySlugs, ...rest } = question

        return {
            ...rest,
            categoryIds: mapCategorySlugsToIds(
                categorySlugs,
                categories
            ),
        }
    })

    return {
        questions: updatedQuestions,
        migrated,
    }
}
