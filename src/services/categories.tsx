import categories from "@/data/Category-2026-09-18.json"
import type {Category} from "@/types/routing-expressions-create.ts";

export async function getCategories(): Promise<Category[]> {
    return categories
}