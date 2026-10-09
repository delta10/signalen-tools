import questions from "@/data/Question-2026-09-08.json"
import type {Question} from "@/types/domain/reference-data.ts";
import {mapQuestionTransfersToDomain} from "@/mappers/import-export.ts";

export async function getQuestions(): Promise<Question[]> {
    return mapQuestionTransfersToDomain(questions)
}