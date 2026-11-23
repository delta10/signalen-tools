import type { Question } from "@/types/domain/reference-data"
import {categoryRepository, questionRepository} from "@/repositories/reference-data"
import { migrateQuestionCategories } from "@/utils/migrate-question-categories"

export async function getQuestions(): Promise<Question[]> {
    const questions = questionRepository.getAll()
    const categories = categoryRepository.getAll()

    const result = migrateQuestionCategories(
        questions,
        categories
    )

    if (result.migrated) {
        questionRepository.saveAll(result.questions)
    }

    return result.questions
}
