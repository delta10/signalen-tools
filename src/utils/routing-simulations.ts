import type {Questions} from "@/types/routing-expressions.ts";

{/* Helper function to split categories from specific question */}
export function getQuestionCategorySlugs(question: Questions): string[] {
    if (!question.categories) {
        return []
    }

    return question.categories
        .split(",")
        .map((category) => category.trim().split("|")[0])
}