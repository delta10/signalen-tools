import {Button} from "@/components/ui/button.tsx";
import {Link} from "@tanstack/react-router";
import { IconPlus } from '@tabler/icons-react';
import { IconFlask } from '@tabler/icons-react';
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {getAreas} from "@/services/areas.tsx";
import {getQuestions} from "@/services/questions-answers.tsx";
import {useQuery} from "@tanstack/react-query";
import {mapExpressionsToTableRows} from "@/mappers/routing-expressions-table.ts";
import {RoutingExpressionsTable} from "@/components/ui/routing-expressions-table.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {getRoutingDomainExpressions} from "@/services/routing-domain-expressions.ts";


export function RoutingExpressionsPage() {
    const [globalFilter, setGlobalFilter] = useState("")

    const {data: expressions = [], isLoading: isExpressionsLoading, error: expressionsError,} = useQuery({
        queryKey: ["routing-domain-expressions"],
        queryFn: getRoutingDomainExpressions,
    })

    const {data: areas = [], isLoading: isAreasLoading, error: areasError,} = useQuery({
        queryKey: ["areas"],
        queryFn: getAreas,
    })

    const {data: questions = [], isLoading: isQuestionsLoading, error: questionsError,} = useQuery({
        queryKey: ["questions"],
        queryFn: getQuestions,
    })

    const tableData = mapExpressionsToTableRows(
        expressions,
        areas,
        questions
    )
    const isLoading = isExpressionsLoading || isQuestionsLoading || isAreasLoading
    const error = expressionsError || questionsError || areasError

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
                    <Button className="rounded-sm" size="lg" asChild>
                        <Link to="/routing-expressions/create" className="flex items-center gap-1">
                            <IconPlus data-icon="inline-start" /> Routing Expression Toevoegen
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return(
        <div className={"flex flex-col"}>
            <div>
                <h1>Routing Expressions</h1>
                <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="w-full lg:w-72 xl:w-80">
                        <Input
                            placeholder="Zoeken..."
                            value={globalFilter}
                            onChange={(event) =>
                                setGlobalFilter(event.target.value)
                            }
                        />
                    </div>

                    <div className="flex w-full gap-3 lg:w-auto lg:justify-end">
                        <Button
                            className="flex-1 rounded-sm lg:flex-none"
                            variant="secondary"
                            size="lg"
                            asChild
                        >
                            <Link
                                to="/routing-expressions/simulate"
                                className="flex items-center gap-1"
                            >
                                <IconFlask data-icon="inline-start" />
                                Routing simuleren
                            </Link>
                        </Button>
                        <Button
                            className="flex-1 rounded-sm lg:flex-none"
                            size="lg"
                            asChild
                        >
                            <Link
                                to="/routing-expressions/create"
                                className="flex items-center gap-1"
                            >
                                <IconPlus data-icon="inline-start" />
                                Routing Expression Toevoegen
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