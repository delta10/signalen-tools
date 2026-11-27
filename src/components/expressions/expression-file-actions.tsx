import { useRef, useState } from "react"
import { IconDots, IconUpload, IconDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import type { Department } from "@/types/domain/reference-data"
import type {ExpressionTransfer, RoutingExpressionTransfer} from "@/types/import-export/expressions"
import {mapTransfersToDomain, mapDomainToTransfers} from "@/mappers/import-export.ts"
import { expressionRepository } from "@/repositories/expression-repository"
import { readJsonFile, downloadJsonFile } from "@/utils/expression-files"
import { toast } from "sonner"
import {useExpressionActions} from "@/hooks/import-export/use-expressions.ts";

type Props = {
    departments: Department[]
}

/* Temporary: will be checked/validated by endpoint eventually */
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

/* Temporary: will be checked/validated by endpoint eventually */
function isExpressionTransferArray(value: unknown): value is ExpressionTransfer[] {
    return Array.isArray(value) && value.length > 0 &&  value.every(
        (item) =>
            isRecord(item) &&
            typeof item.name === "string" &&
            typeof item.code === "string" &&
            typeof item._type === "string"
    )
}

/* Temporary: will be checked/validated by endpoint eventually */
function isRoutingExpressionTransferArray(value: unknown): value is RoutingExpressionTransfer[] {
    return Array.isArray(value) && value.length > 0 && value.every(
        (item) =>
            isRecord(item) &&
            typeof item._expression === "string" &&
            typeof item._department === "string" &&
            typeof item.order === "string" &&
            (item.is_active === "0" || item.is_active === "1")
    )
}

export function ExpressionFileActions({ departments }: Props) {
    const expressionInputRef = useRef<HTMLInputElement>(null)
    const routingInputRef = useRef<HTMLInputElement>(null)
    const [expressions, setExpressions] = useState<ExpressionTransfer[] | null>(null)
    const [routingExpressions, setRoutingExpressions] = useState<RoutingExpressionTransfer[] | null>(null)
    const { saveAll } = useExpressionActions()

    const [isImporting, setIsImporting] = useState(false)

    async function handleImport(file: File | undefined, type: "expression" | "routing") {
        if (!file) return
        setIsImporting(true)

        try {
            const parsed = await readJsonFile<unknown>(file)

            if (type === "expression") {
                if (!isExpressionTransferArray(parsed)) {
                    throw new Error(
                        "Het bestand heeft niet het juiste Expression-formaat."
                    )
                }

                setExpressions(parsed)

                if (routingExpressions !== null) {
                    importExpressions(parsed, routingExpressions)
                } else {
                    toast.info("Expression-bestand ingelezen. Importeer nu RoutingExpression.json.")
                }
            } else {
                if (!isRoutingExpressionTransferArray(parsed)) {
                    throw new Error("Het bestand heeft niet het juiste RoutingExpression-formaat.")
                }

                setRoutingExpressions(parsed)

                if (expressions !== null) {
                    importExpressions(expressions, parsed)
                } else {
                    toast.info("RoutingExpression-bestand ingelezen. Importeer nu Expression.json.")
                }
            }
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Er is iets misgegaan tijdens het importeren."
            )
        } finally {
            setIsImporting(false)

            if (expressionInputRef.current) {
                expressionInputRef.current.value = ""
            }

            if (routingInputRef.current) {
                routingInputRef.current.value = ""
            }
        }
    }

    function handleExport() {
        try {
            const expressions = expressionRepository.getAll()
            const transfers = mapDomainToTransfers(expressions)
            const date = new Date().toLocaleDateString("sv-SE")

            downloadJsonFile(`Expression-${date}.json`, transfers.expressions)
            downloadJsonFile(`RoutingExpression-${date}.json`, transfers.routingExpressions)

            toast.success("Expressies succesvol geëxporteerd")
        } catch {
            toast.error("Er is iets misgegaan tijdens het exporteren.")
        }
    }

    function importExpressions(expressions: ExpressionTransfer[], routingExpressions: RoutingExpressionTransfer[]) {
        const names = new Set(expressions.map((expression) => expression.name))

        if (routingExpressions.some(
            (routing) => !names.has(routing._expression)
        )) {
            throw new Error(
                "Niet alle routing expressions hebben een bijbehorende expressie."
            )
        }

        const domainExpressions = mapTransfersToDomain(routingExpressions, expressions, departments)
        saveAll(domainExpressions)

        setExpressions(null)
        setRoutingExpressions(null)

        toast.success(`${domainExpressions.length} expressies succesvol geïmporteerd.`)
    }

    return (
        <>
            <input
                ref={expressionInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(event) => {
                    void handleImport(
                        event.target.files?.[0],
                        "expression"
                    )
                }}
            />
            <input
                ref={routingInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(event) => {
                    void handleImport(
                        event.target.files?.[0],
                        "routing"
                    )
                }}
            />

            <div className={"flex flex-row"}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Meer acties">
                            <IconDots />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={"min-w-50"}>
                        <DropdownMenuItem disabled={isImporting}
                            onSelect={() => expressionInputRef.current?.click()}
                        >
                            <IconUpload />
                            Expression.json importeren
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={isImporting}
                            onSelect={() => routingInputRef.current?.click()}
                        >
                            <IconUpload />
                            RoutingExpression.json importeren
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={handleExport}>
                            <IconDownload />
                            Exporteren
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    )
}