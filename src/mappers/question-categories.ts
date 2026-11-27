import type { Category } from "@/types/domain/reference-data"

export function mapCategorySlugsToIds(slugs: string[], categories: Category[]): number[] {
    return [...new Set(slugs)].map(slug => {
        const matches = categories.filter(
            category => category.slug === slug
        )

        if (matches.length === 0) {
            throw new Error(
                `Categorie "${slug}" is niet gevonden.`
            )
        }

        if (matches.length > 1) {
            throw new Error(
                `Categorie "${slug}" is niet uniek. ` +
                `De brondata bevat meerdere categorieën met deze slug.`
            )
        }

        return matches[0].id
    })
}

export function parseQuestionCategorySlugs(value: string): string[] {
    return value
        .split(",")
        .map(category => category.trim().split("|")[0])
        .filter(Boolean)
}
