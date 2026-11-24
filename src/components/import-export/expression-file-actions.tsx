import { useRef, useState } from "react"
import { IconDots, IconUpload, IconDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button.tsx"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu.tsx"
import type { Department } from "@/types/domain/reference-data.ts"
import { toast } from "sonner"
import { useExpressionActions } from "@/hooks/import-export/use-expressions.ts"
import {importExpressions, exportExpressions,} from "@/services/expression-import-export.tsx"
import {questionRepository} from "@/repositories/reference-data.ts";
import {validateQuestionReferences} from "@/utils/questions.ts";
import {expressionRepository} from "@/repositories/expression-repository.ts";
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";


type Props = {
    departments: Department[],
    variant?: "dropdown" | "buttons"
}

export function ExpressionFileActions({ departments, variant = "dropdown", }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [exportWarnings, setExportWarnings] = useState<string[]>([])
    const { saveAll } = useExpressionActions()

    const [isImporting, setIsImporting] = useState(false)

    async function handleImport(files: FileList | null) {
        if (!files) return

        setIsImporting(true)

        try {
            const expressions = await importExpressions(files, departments)

            saveAll(expressions)

            toast.success(
                `${expressions.length} expressies succesvol geïmporteerd.`
            )
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

            {variant === "buttons" ? (
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isImporting}
                        onClick={() => inputRef.current?.click()}
                    >
                        <IconUpload />
                        {isImporting ? "Importeren..." : "Importeren"}
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

                    <ul className="max-h-60 list-disc space-y-2
                       overflow-y-auto pl-5 text-sm">
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