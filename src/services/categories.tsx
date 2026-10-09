import categories from "@/data/Category-2026-09-18.json"
import {mapCategoryTransfersToDomain} from "@/mappers/import-export.ts";
import type {Category} from "@/types/domain/reference-data.ts";

export async function getCategories(): Promise<Category[]> {
    return mapCategoryTransfersToDomain(categories)
}