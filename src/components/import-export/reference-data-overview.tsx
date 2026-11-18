import { useState } from "react"
import {IconCheck, IconAlertTriangle, IconArrowRight} from "@tabler/icons-react"
import {
    categoryRepository,
    areaRepository,
    departmentRepository,
    questionRepository,
} from "@/repositories/reference-data"
import { ReferenceDataFileActions } from "./reference-data-file-actions"
import {DataManagementCard} from "@/components/import-export/data-management-card.tsx";
import {ExpressionFileActions} from "@/components/import-export/expression-file-actions.tsx";
import type {Department} from "@/types/domain/reference-data.ts";
import {Link} from "@tanstack/react-router";
import {Button} from "@/components/ui/button.tsx";
import { useExpressions } from "@/hooks/import-export/use-expressions"

const datasets = [
    {
        type: "categories",
        label: "Categorieën",
        repository: categoryRepository,
        required: true,
    },
    {
        type: "areas",
        label: "Gebieden",
        repository: areaRepository,
        required: true,
    },
    {
        type: "departments",
        label: "Afdelingen",
        repository: departmentRepository,
        required: true,
    },
    {
        type: "questions",
        label: "Vragen en antwoorden",
        repository: questionRepository,
        required: true,
    },
] as const

type Props = {
    departments: Department[],
}

export function ReferenceDataOverview({departments}: Props) {
    const [, setRevision] = useState(0)
    const { data: expressions = [] } = useExpressions()

    const refresh = () => setRevision((value) => value + 1)

    const importedCount = datasets.filter(
        (dataset) => dataset.repository.hasData()
    ).length

    const isReady = importedCount === datasets.length

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-semibold">
                    Referentiegegevens
                </h2>
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
                                ? "Alle referentiegegevens zijn beschikbaar"
                                : `${importedCount} van de ${datasets.length} verplichte datasets geïmporteerd`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {isReady
                                ? "Het systeem is klaar voor gebruik."
                                : "Importeer alle vier de datasets om te beginnen."}
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
                >
                    <ExpressionFileActions
                        departments={departments}
                        variant="buttons"
                    />
                </DataManagementCard>
                <div className="flex flex-col items-center justify-center gap-2 pt-4">
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
        </div>
    )
}