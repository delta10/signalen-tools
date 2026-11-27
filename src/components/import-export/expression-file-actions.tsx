import { useRef, useState } from "react"
import { IconDots, IconUpload, IconDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import type { Department } from "@/types/domain/reference-data.ts"
import type {
    ExpressionTransfer,
    RoutingExpressionTransfer,
} from "@/types/import-export/expressions"
import { toast } from "sonner"
import { useExpressionActions } from "@/hooks/import-export/use-expressions.ts"
import {
    readExpressionFile,
    readRoutingExpressionFile,
    importExpressions,
    exportExpressions,
} from "@/services/expression-import-export.tsx"
import { questionRepository } from "@/repositories/reference-data.ts"
import { validateQuestionReferences } from "@/utils/questions.ts"
import { expressionRepository } from "@/repositories/expression-repository.ts"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx"

type Props = {
    departments: Department[]
    variant?: "dropdown" | "buttons"
    onImported?: () => void
}

export function ExpressionFileActions({departments, variant = "dropdown", onImported}: Props) {
    const expressionInputRef = useRef<HTMLInputElement>(null)
    const routingInputRef = useRef<HTMLInputElement>(null)
    const [expressions, setExpressions] = useState<ExpressionTransfer[] | null>(null)
    const [routingExpressions, setRoutingExpressions] = useState<RoutingExpressionTransfer[] | null>(null)
    const [isImporting, setIsImporting] = useState(false)
    const [exportWarnings, setExportWarnings] = useState<string[]>([])

    const { saveAll } = useExpressionActions()

    function completeImport(expressions: ExpressionTransfer[], routingExpressions: RoutingExpressionTransfer[]) {
        const domainExpressions = importExpressions(
            expressions,
            routingExpressions,
            departments
        )

        saveAll(domainExpressions)
        expressionRepository.setImportedAt()
        onImported?.()

        setExpressions(null)
        setRoutingExpressions(null)
        toast.success(`${domainExpressions.length} expressies succesvol geïmporteerd.`)
    }

    async function handleImport(file: File | undefined, type: "expression" | "routing") {
        if (!file) return

        setIsImporting(true)

        try {
            if (type === "expression") {
                const parsed = await readExpressionFile(file)

                setExpressions(parsed)

                if (routingExpressions !== null) {
                    completeImport(parsed, routingExpressions)
                } else {
                    toast.info(
                        "Expression-bestand ingelezen. Importeer nu RoutingExpression.json."
                    )
                }
            } else {
                const parsed = await readRoutingExpressionFile(file)

                setRoutingExpressions(parsed)

                if (expressions !== null) {
                    completeImport(expressions, parsed)
                } else {
                    toast.info(
                        "RoutingExpression-bestand ingelezen. Importeer nu Expression.json."
                    )
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

    function performExport() {
        try {
            exportExpressions()
            setExportWarnings([])

            toast.success("Expressies succesvol geëxporteerd")
        } catch {
            toast.error("Er is iets misgegaan tijdens het exporteren.")
        }
    }

    function handleExport() {
        try {
            const warnings = questionRepository.hasData()
                ? validateQuestionReferences(
                    expressionRepository.getAll(),
                    questionRepository.getAll()
                )
                : [
                    "Er zijn geen vraaggegevens geïmporteerd. " +
                    "Vraagverwijzingen konden niet worden gecontroleerd."
                ]

            if (warnings.length > 0) {
                setExportWarnings(warnings)
                return
            }

            performExport()
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "De exportcontrole kon niet worden uitgevoerd."
            )
        }
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

            {variant === "buttons" ? (
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isImporting}
                        onClick={() => expressionInputRef.current?.click()}
                    >
                        <IconUpload />
                        Expression
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={isImporting}
                        onClick={() => routingInputRef.current?.click()}
                    >
                        <IconUpload />
                        RoutingExpression
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleExport}
                    >
                        <IconDownload />
                        Exporteren
                    </Button>
                </div>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label="Meer acties"
                        >
                            <IconDots />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="min-w-50">
                        <DropdownMenuItem
                            disabled={isImporting}
                            onSelect={() => expressionInputRef.current?.click()}
                        >
                            <IconUpload />
                            Expression.json importeren
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            disabled={isImporting}
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
            )}
            <AlertDialog
                open={exportWarnings.length > 0}
                onOpenChange={open => {
                    if (!open) setExportWarnings([])
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Mogelijk ongeldige routeringen
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Tijdens de exportcontrole zijn mogelijk
                            ongeldige vraag- of antwoordverwijzingen
                            aangetroffen. Controleer onderstaande
                            meldingen voordat je verdergaat.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <ul className="max-h-60 list-disc space-y-2 overflow-y-auto pl-5 text-sm">
                        {exportWarnings.map(warning => (
                            <li key={warning}>
                                {warning}
                            </li>
                        ))}
                    </ul>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Annuleren
                        </AlertDialogCancel>

                        <Button onClick={performExport}>
                            Toch exporteren
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}