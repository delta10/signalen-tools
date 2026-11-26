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
    exportQuestions, importUsers,
} from "@/services/reference-data-import-export"
import {questionsQueryKey} from "@/hooks/questions/use-questions.ts";
import {usersQueryKey} from "@/hooks/users/use-users.ts";

type ReferenceDataType =
    | "categories"
    | "areas"
    | "departments"
    | "questions"
    | "users"

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
        accept: ".json,application/json",
    },
    areas: {
        import: importAreas,
        export: exportAreas,
        queryKey: ["areas"],
        accept: ".json,application/json",
    },
    departments: {
        import: importDepartments,
        export: exportDepartments,
        queryKey: ["departments"],
        accept: ".json,application/json",
    },
    questions: {
        import: importQuestions,
        export: exportQuestions,
        queryKey: questionsQueryKey,
        accept: ".json,application/json",
    },
    users: {
        import: importUsers,
        export: undefined,
        queryKey: usersQueryKey,
        accept: ".csv,text/csv",
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
        if (!action.export) return

        try {
            action.export()
            toast.success("Gegevens succesvol geëxporteerd.")
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Er is iets misgegaan tijdens het exporteren."
            )
        }
    }

    return (
        <div className="flex gap-2">
            <input
                ref={inputRef}
                type="file"
                accept={action.accept}
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

            {action.export && (
                <Button
                    type="button"
                    variant="outline"
                    disabled={!hasData}
                    onClick={handleExport}
                >
                    <IconDownload />
                    Exporteren
                </Button>
            )}
        </div>
    )
}