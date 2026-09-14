import questions from "@/data/Question-2026-09-08.json"
import type {Questions} from "@/types/routing-expressions.ts";

{/* Endpoint(s) can eventually be fetched here */}
export async function getQuestions(): Promise<Questions[]> {
    return questions
}