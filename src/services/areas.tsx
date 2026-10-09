import areas from "@/data/Area-2026-09-08.json"
import type {Area} from "@/types/domain/reference-data.ts";
import {mapAreaTransfersToDomain} from "@/mappers/import-export.ts";

export async function getAreas(): Promise<Area[]> {
    return mapAreaTransfersToDomain(areas)
}