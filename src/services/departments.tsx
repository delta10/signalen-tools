import departments from "@/data/Department-2026-09-08.json";

export type Department = {
    "code": string,
    "name": string,
    "is_intern": string,
    "can_direct": string,
    "categories": string
}
export async function getDepartments(): Promise<Department[]> {
    return departments
}