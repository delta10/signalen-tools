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
    const inputRef = useRef<HTMLInputElement>(null)
    const { saveAll } = useExpressionActions()

    const [isImporting, setIsImporting] = useState(false)

    async function handleImport(files: FileList | null) {
        if (!files) return

        setIsImporting(true)

        try {
            const selectedFiles = Array.from(files)

            if (selectedFiles.length !== 2) {
                throw new Error(
                    "Selecteer de 2 JSON bestanden van expressions en RoutingExpressions"
                )
            }

            const parsedFiles = await Promise.all(
                selectedFiles.map((file) => readJsonFile<unknown>(file))
            )

            // Identify files by their content
            const expressions = parsedFiles.find(isExpressionTransferArray)
            const routingExpressions = parsedFiles.find(isRoutingExpressionTransferArray)

            if (!expressions || !routingExpressions) {
                throw new Error("De bestanden hebben niet het juiste JSON-formaat.")
            }

            // Prevent losing unmatched routing expressions
            const names = new Set(
                expressions.map((expression) => expression.name)
            )

            if (routingExpressions.some(
                    (routing) => !names.has(routing._expression)
                )
            ) {
                throw new Error(
                    "Niet alle routing expressions hebben een bijbehorende expressie."
                )
            }

            const domainExpressions = mapTransfersToDomain(
                routingExpressions,
                expressions,
                departments
            )

            saveAll(domainExpressions)
            toast.success(`${domainExpressions.length} expressies succesvol geïmporteerd.`)
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Er is iets misgegaan tijdens het importeren."
            )
        } finally {
            setIsImporting(false)

            if (inputRef.current) {
                inputRef.current.value = ""
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

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept=".json,application/json"
                multiple
                className="hidden"
                aria-label="Selecteer beide JSON-bestanden"
                onChange={(event) => {
                    void handleImport(event.target.files)
                }}
            />

            <div className={"flex flex-row"}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Meer acties">
                            <IconDots />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            disabled={isImporting}
                            onSelect={() => inputRef.current?.click()}
                        >
                            <IconUpload />
                            Importeren
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