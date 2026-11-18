import { useRef, useState } from "react"
import { IconDots, IconUpload, IconDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button.tsx"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu.tsx"
import type { Department } from "@/types/domain/reference-data.ts"
import { toast } from "sonner"
import { useExpressionActions } from "@/hooks/import-export/use-expressions.ts"
import {importExpressions, exportExpressions,} from "@/services/expression-import-export.tsx"

type Props = {
    departments: Department[],
    variant?: "dropdown" | "buttons"
}

export function ExpressionFileActions({ departments, variant = "dropdown", }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
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

    function handleExport() {
        try {
            exportExpressions()
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
        </>
    )
}