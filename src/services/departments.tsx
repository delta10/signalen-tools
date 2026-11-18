import type { Department } from "@/types/domain/reference-data"
import { departmentRepository } from "@/repositories/reference-data"

export async function getDepartments(): Promise<Department[]> {
    return departmentRepository.getAll()
}