import type { Question } from "@/types/domain/reference-data"
import { questionRepository } from "@/repositories/reference-data"

export async function getQuestions(): Promise<Question[]> {
    return questionRepository.getAll()
}