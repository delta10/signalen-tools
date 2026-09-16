import departments from "@/data/Department-2026-09-08.json";
import type {Department} from "@/types/routing-expressions.ts";

{/* Endpoint(s) can eventually be fetched here */}
export async function getDepartments(): Promise<Department[]> {
    return departments
}