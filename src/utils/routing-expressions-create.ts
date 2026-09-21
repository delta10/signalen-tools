import type {Questions} from "@/types/routing-expressions.ts";

{/* Helper function to extract possible answers from question.meta */}
export function getQuestionAnswers(question: Questions): string[] {
    try {
        const meta = JSON.parse(question.meta)

        if (!meta.values) {
            return []
        }

        return Object.values(meta.values)
    } catch {
        return []
    }
}