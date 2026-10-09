import expressions from "@/data/Expression-2026-09-08.json"
import type {ExpressionTransfer} from "@/types/import-export/expressions.ts";

export async function getExpressions(): Promise<ExpressionTransfer[]> {
    const newExpressions: ExpressionTransfer[] =
        JSON.parse(localStorage.getItem("newExpressions") ?? "[]")

    return [...expressions, ...newExpressions]
}