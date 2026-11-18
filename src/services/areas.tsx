import type { Area } from "@/types/domain/reference-data"
import { areaRepository } from "@/repositories/reference-data"

export async function getAreas(): Promise<Area[]> {
    return areaRepository.getAll()
}