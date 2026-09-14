import expressions from "@/data/Expression-2026-09-08.json"
import type {Expression} from "@/types/routing-expressions.ts";

{/* Endpoint(s) can eventually be fetched here */}
export async function getExpressions(): Promise<Expression[]> {
    return expressions
}