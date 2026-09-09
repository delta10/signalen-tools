import areas from "@/data/Area-2026-09-08.json"
import type {Area} from "@/types/routing-expressions.ts";

export async function getAreas(): Promise<Area[]> {
    return areas
}