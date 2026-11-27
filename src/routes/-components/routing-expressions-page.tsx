import {Button} from "@/components/ui/button.tsx";
import {Link} from "@tanstack/react-router";
import {IconPlus} from '@tabler/icons-react';
import { IconFlask } from '@tabler/icons-react';
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {getAreas} from "@/services/areas.tsx";
import {useQuery} from "@tanstack/react-query";
import {mapExpressionsToTableRows} from "@/mappers/routing-expressions-table.ts";
import {RoutingExpressionsTable} from "@/components/ui/routing-expressions-table.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {ExpressionFileActions} from "@/components/import-export/expression-file-actions.tsx";
import {getDepartments} from "@/services/departments.tsx";
import {useExpressions} from "@/hooks/import-export/use-expressions.ts";
import { getReferenceDataStatus } from "@/utils/reference-data-status";
import {useQuestions} from "@/hooks/questions/use-questions.ts";


export function RoutingExpressionsPage() {
    const [globalFilter, setGlobalFilter] = useState("")
    const { isReady } = getReferenceDataStatus()

    const {data: expressions = [], isLoading: isExpressionsLoading, error: expressionsError,} = useExpressions()

    const {data: areas = [], isLoading: isAreasLoading, error: areasError,} = useQuery({
        queryKey: ["areas"],
        queryFn: getAreas,
    })

    const {data: departments = [], isLoading: isDepartmentsLoading, error: departmentsError,} = useQuery({
        queryKey: ["departments"],
        queryFn: getDepartments,
    })

    const {data: questions = [], isLoading: isQuestionsLoading, error: questionsError,} = useQuestions()

    const tableData = mapExpressionsToTableRows(
        expressions,
        areas,
        questions
    )
    const isLoading = isExpressionsLoading || isDepartmentsLoading || isQuestionsLoading || isAreasLoading
    const error = expressionsError || departmentsError || questionsError || areasError

    if(isLoading) {
        return(
            <Skeleton className={"h-12"} />
        )
    }

    if(error) {
        return(
            <div className="h-full flex flex-col">
                <h1>Routing Expressions</h1>
                <div className="flex flex-col items-center justify-center gap-4 flex-1">
                    <p>Er is iets misgegaan</p>
                    <Button className="rounded-sm" size="lg" asChild>
                        <Link to="/" className="flex items-center gap-1">
                            Terug naar Home
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    if (expressions.length === 0) {
        return (
            <div className="h-full flex flex-col">
                <h1>Routing Expressions</h1>
                <div className="flex flex-col items-center justify-center gap-4 flex-1">
                    <p>Er zijn nog geen routeerregels aangemaakt.</p>
                    <div className={"flex justify-center gap-4"}>
                        {isReady ? (
                            <Button className="rounded-sm" size="lg" asChild>
                                <Link to="/routing-expressions/create">
                                    <IconPlus data-icon="inline-start" />
                                    Routing Expression Toevoegen
                                </Link>
                            </Button>
                        ) : (
                            <div className={"flex flex-col justify-center items-center gap-4"}>
                            <Button className="rounded-sm" size="lg" disabled>
                                <IconPlus data-icon="inline-start" />
                                Routing Expression Toevoegen
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Importeer eerst de verplichte referentiegegevens via de{" "}
                                <Link to="/" className="underline">
                                    homepagina
                                </Link>.
                            </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div className={"flex flex-col"}>
            <div>
                <h1>Routing Expressions</h1>
                <div className={"flex justify-between items-center mt-4"}>
                    <div>
                        <Input
                            className={"w-full"}
                            placeholder={"Zoeken..."}
                            value={globalFilter}
                            onChange={(event) => {
                                setGlobalFilter(event.target.value)
                            }}
                        />
                    </div>
                    <div className={"flex flex-col items-end lg:flex-row lg:justify-end gap-4"}>
                        <ExpressionFileActions departments={departments} />
                        {isReady ? (
                            <Button className="rounded-sm lg:order-2" size="lg" asChild>
                                <Link to="/routing-expressions/create">
                                    <IconPlus data-icon="inline-start" />
                                    Routing Expression Toevoegen
                                </Link>
                            </Button>
                        ) : (
                            <div className={"flex flex-col justify-center items-center gap-4"}>
                                <Button className="rounded-sm lg:order-2" size="lg" disabled>
                                    <IconPlus data-icon="inline-start" />
                                    Routing Expression Toevoegen
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                    Importeer eerst de verplichte referentiegegevens via de{" "}
                                    <Link to="/" className="underline">
                                        homepagina
                                    </Link>.
                                </p>
                            </div>
                        )}
                        <Button className={"rounded-sm lg:order-1"} variant={"secondary"} size={"lg"} asChild>
                            <Link to={"/routing-expressions/simulate"} className={"flex items-center gap-1"}>
                                <IconFlask data-icon={"inline-start"} /> Routing simuleren
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div className={"py-6"}>
                <RoutingExpressionsTable
                    tableData={tableData}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                />
            </div>
        </div>
    )
}