import type {Expression} from "@/types/domain/routing.ts";
import {getRoutingExpressions} from "@/services/routing-expressions.tsx";
import {getExpressions} from "@/services/expressions.tsx";
import {getDepartments} from "@/services/departments.tsx";
import {mapTransfersToDomain} from "@/mappers/import-export.ts";

export async function getRoutingDomainExpressions(): Promise<Expression[]> {
    const [routingExpressions, expressions, departments] =
        await Promise.all([
            getRoutingExpressions(),
            getExpressions(),
            getDepartments(),
        ])

    return mapTransfersToDomain(
        routingExpressions,
        expressions,
        departments
    )
}