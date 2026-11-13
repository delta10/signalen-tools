import departments from "@/data/Department-2026-09-08.json"
import {mapDepartmentTransfersToDomain} from "@/mappers/import-export.ts";
import type {Department} from "@/types/domain/reference-data.ts";

export async function getDepartments(): Promise<Department[]> {
    return mapDepartmentTransfersToDomain(departments)
}