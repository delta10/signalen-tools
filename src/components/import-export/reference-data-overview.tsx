import { useState } from "react"
import {IconCheck, IconAlertTriangle, IconArrowRight, IconTrash} from "@tabler/icons-react"
import {
    categoryRepository,
    areaRepository,
    departmentRepository,
    questionRepository,
    userRepository
} from "@/repositories/reference-data"
import { expressionRepository } from "@/repositories/expression-repository.ts"
import { ReferenceDataFileActions } from "./reference-data-file-actions"
import {DataManagementCard} from "@/components/import-export/data-management-card.tsx";
import {ExpressionFileActions} from "@/components/import-export/expression-file-actions.tsx";
import type {Department} from "@/types/domain/reference-data.ts";
import {Link} from "@tanstack/react-router";
import {Button} from "@/components/ui/button.tsx";
import {useExpressionActions, useExpressions} from "@/hooks/import-export/use-expressions"
import {useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";

const datasets = [
    {
        type: "categories",
        label: "Categorieën",
        repository: categoryRepository,
        required: true,
        recommended: false,
        fileName: "Category.json",
        djangoPath: "/signals/category/",
    },
    {
        type: "areas",
        label: "Gebieden",
        repository: areaRepository,
        required: true,
        recommended: false,
        fileName: "Area.json",
        djangoPath: "/signals/area/",
    },
    {
        type: "departments",
        label: "Afdelingen",
        repository: departmentRepository,
        required: true,
        recommended: false,
        fileName: "Department.json",
        djangoPath: "/signals/department/",
    },
    {
        type: "questions",
        label: "Vragen en antwoorden",
        repository: questionRepository,
        required: false,
        recommended: true,
        fileName: "Question.json",
        djangoPath: "/signals/question/",
    },
    {
        type: "users",
        label: "Gebruikers",
        repository: userRepository,
        required: false,
        recommended: false,
        fileName: "User.csv",
        djangoPath: "/auth/user/",
    },
] as const

type Props = {
    departments: Department[],
    signalenUrl: string
}

export function ReferenceDataOverview({departments, signalenUrl}: Props) {
    const [, setRevision] = useState(0)
    const [importResetKey, setImportResetKey] = useState(0)
    const { data: expressions = [] } = useExpressions()
    const queryClient = useQueryClient()
    const { saveAll } = useExpressionActions()

    const refresh = () => setRevision((value) => value + 1)
    async function handleClearAll() {
        try {
            datasets.forEach((dataset) => {
                dataset.repository.clear()
            })

            saveAll([])
            expressionRepository.clearImportedAt()
            setImportResetKey((value) => value + 1)

            await Promise.all(
                datasets.map((dataset) =>
                    queryClient.invalidateQueries({
                        queryKey: [dataset.type],
                    })
                )
            )

            refresh()

            toast.success("Alle imports zijn gewist.")
        } catch {
            refresh()
            toast.error("Niet alle gegevens konden worden gewist.")
        }
    }

    const requiredDatasets = datasets.filter(
        (dataset) => dataset.required
    )

    const importedCount = requiredDatasets.filter(
        (dataset) => dataset.repository.hasData()
    ).length

    const isReady = importedCount === requiredDatasets.length
    const hasAnyData =
        datasets.some((dataset) => dataset.repository.hasData()) ||
        expressions.length > 0 ||
        expressionRepository.getImportedAt() !== null

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                    Referentiegegevens
                </h2>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            disabled={!hasAnyData}
                            className="text-destructive"
                        >
                            <IconTrash />
                            Alle imports wissen
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Weet je zeker dat je alle imports wilt wissen?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Alle lokaal opgeslagen referentiegegevens
                                en routeringsregels worden verwijderd,
                                inclusief zelf aangemaakte en gewijzigde
                                regels. Exporteer eventueel eerst je zelf aangemaakte
                                routeerregels voordat je alle datasets verwijdert.<br />
                                Deze actie kan niet ongedaan worden gemaakt.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Annuleren
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-white hover:bg-destructive/90"
                                onClick={() => void handleClearAll()}
                            >
                                Alles wissen
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                    {isReady ? (
                        <IconCheck className="text-green-600" />
                    ) : (
                        <IconAlertTriangle className="text-amber-600" />
                    )}

                    <div>
                        <p className="font-medium">
                            {isReady
                                ? "Alle verplichte referentiegegevens zijn beschikbaar"
                                : `${importedCount} van de ${requiredDatasets.length} verplichte datasets geïmporteerd`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {isReady
                                ? "Het systeem is klaar voor gebruik."
                                : "Importeer alle verplichte datasets om te beginnen."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {datasets.map((dataset) => {
                    const imported = dataset.repository.hasData()
                    const count = dataset.repository.getAll().length

                    return (
                        <DataManagementCard
                            key={dataset.type}
                            title={dataset.label}
                            count={count}
                            imported={imported}
                            files={[
                                {
                                    name: dataset.fileName,
                                    djangoUrl: signalenUrl
                                        ? `${signalenUrl}${dataset.djangoPath}`
                                        : undefined,
                                },
                            ]}
                            optional={!dataset.required}
                            recommended={dataset.recommended}
                            importedAt={dataset.repository.getImportedAt()}
                        >
                            <ReferenceDataFileActions
                                type={dataset.type}
                                hasData={imported}
                                onImported={refresh}
                            />
                        </DataManagementCard>
                    )
                })}
                <DataManagementCard
                    title="Routing Expressions"
                    count={expressions.length}
                    imported={expressions.length > 0}
                    optional
                    files={[
                        {
                            name: "Expression.json",
                            djangoUrl: signalenUrl
                                ? `${signalenUrl}/signals/expression/`
                                : undefined,
                        },
                        {
                            name: "RoutingExpression.json",
                            djangoUrl: signalenUrl
                                ? `${signalenUrl}/signals/routingexpression/`
                                : undefined,
                        },
                    ]}
                    importedAt={expressionRepository.getImportedAt()}
                >
                    <ExpressionFileActions
                        key={importResetKey}
                        departments={departments}
                        variant="buttons"
                        onImported={refresh}
                    />
                </DataManagementCard>
            </div>
            <div className="flex justify-start">
                {isReady ? (
                    <Button asChild>
                        <Link to="/routing-expressions">
                            Starten
                            <IconArrowRight />
                        </Link>
                    </Button>
                ) : (
                    <Button disabled>
                        Starten
                        <IconArrowRight />
                    </Button>
                )}
            </div>
        </div>
    )
}