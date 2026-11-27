import type { Department } from "@/types/domain/reference-data"
import type {ExpressionTransfer, RoutingExpressionTransfer,} from "@/types/import-export/expressions"
import {mapTransfersToDomain, mapDomainToTransfers,} from "@/mappers/import-export"
import { expressionRepository } from "@/repositories/expression-repository"
import { readJsonFile, downloadJsonFile } from "@/utils/expression-files"
import type { Expression } from "@/types/domain/routing"

// Existing validation helpers
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object"
        && value !== null
        && !Array.isArray(value)
}

function isExpressionTransferArray(
    value: unknown
): value is ExpressionTransfer[] {
    return Array.isArray(value)
        && value.length > 0
        && value.every(
            (item) =>
                isRecord(item) &&
                typeof item.name === "string" &&
                typeof item.code === "string" &&
                typeof item._type === "string"
        )
}

function isRoutingExpressionTransferArray(
    value: unknown
): value is RoutingExpressionTransfer[] {
    return Array.isArray(value)
        && value.length > 0
        && value.every(
            (item) =>
                isRecord(item) &&
                typeof item._expression === "string" &&
                typeof item._department === "string" &&
                typeof item.order === "string" &&
                (item.is_active === "0" || item.is_active === "1")
        )
}

// Import: read, validate and map the selected files
export async function readExpressionFile(file: File): Promise<ExpressionTransfer[]> {
    const parsed = await readJsonFile<unknown>(file)

    if (!isExpressionTransferArray(parsed)) {
        throw new Error(
            "Het bestand heeft niet het juiste Expression-formaat."
        )
    }

    return parsed
}

export async function readRoutingExpressionFile(file: File): Promise<RoutingExpressionTransfer[]> {
    const parsed = await readJsonFile<unknown>(file)

    if (!isRoutingExpressionTransferArray(parsed)) {
        throw new Error(
            "Het bestand heeft niet het juiste RoutingExpression-formaat."
        )
    }

    return parsed
}

export function importExpressions(
    expressions: ExpressionTransfer[],
    routingExpressions: RoutingExpressionTransfer[],
    departments: Department[]
): Expression[] {
    const names = new Set(
        expressions.map((expression) => expression.name)
    )

    if (routingExpressions.some(
        (routing) => !names.has(routing._expression)
    )) {
        throw new Error(
            "Niet alle routing expressions hebben een bijbehorende expressie."
        )
    }

    return mapTransfersToDomain(
        routingExpressions,
        expressions,
        departments
    )
}

// Export: map the stored domain expressions to transfer models
export function exportExpressions(): void {
    const expressions = expressionRepository.getAll()
    const transfers = mapDomainToTransfers(expressions)
    const date = new Date().toLocaleDateString("sv-SE")

    downloadJsonFile(
        `Expression-${date}.json`,
        transfers.expressions
    )

    downloadJsonFile(
        `RoutingExpression-${date}.json`,
        transfers.routingExpressions
    )
}