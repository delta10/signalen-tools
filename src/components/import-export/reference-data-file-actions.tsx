import { useRef, useState } from "react"
import { IconUpload, IconDownload } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    importCategories,
    importAreas,
    importDepartments,
    importQuestions,
    exportCategories,
    exportAreas,
    exportDepartments,
    exportQuestions,
} from "@/services/reference-data-import-export"

type ReferenceDataType =
    | "categories"
    | "areas"
    | "departments"
    | "questions"

type Props = {
    type: ReferenceDataType
    hasData: boolean
    onImported: () => void
}

const actions = {
    categories: {
        import: importCategories,
        export: exportCategories,
        queryKey: ["categories"],
    },
    areas: {
        import: importAreas,
        export: exportAreas,
        queryKey: ["areas"],
    },
    departments: {
        import: importDepartments,
        export: exportDepartments,
        queryKey: ["departments"],
    },
    questions: {
        import: importQuestions,
        export: exportQuestions,
        queryKey: ["questions"],
    },
}

export function ReferenceDataFileActions({type, hasData, onImported,}: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isImporting, setIsImporting] = useState(false)
    const queryClient = useQueryClient()

    const action = actions[type]

    async function handleImport(file: File | undefined) {
        if (!file) return

        setIsImporting(true)

        try {
            await action.import(file)

            await queryClient.invalidateQueries({
                queryKey: action.queryKey,
            })

            onImported()

            toast.success("Gegevens succesvol geïmporteerd.")
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
            action.export()
            toast.success("Gegevens succesvol geëxporteerd.")
        } catch {
            toast.error(
                "Er is iets misgegaan tijdens het exporteren."
            )
        }
    }

    return (
        <div className="flex gap-2">
            <input
                ref={inputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                aria-label={`Importeer ${type}`}
                onChange={(event) => {
                    void handleImport(event.target.files?.[0])
                }}
            />

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
                disabled={!hasData}
                onClick={handleExport}
            >
                <IconDownload />
                Exporteren
            </Button>
        </div>
    )
}