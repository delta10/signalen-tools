import type { Category } from "@/types/domain/reference-data"
import { categoryRepository } from "@/repositories/reference-data"

export async function getCategories(): Promise<Category[]> {
    return categoryRepository.getAll()
}