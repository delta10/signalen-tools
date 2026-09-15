import {Button} from "@/components/ui/button.tsx";
import {Link} from "@tanstack/react-router";
import { IconPlus } from '@tabler/icons-react';
import { IconFlask } from '@tabler/icons-react';
import {getRoutingExpressions} from "@/services/routing-expressions.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {getDepartments} from "@/services/departments.tsx";
import {getExpressions} from "@/services/expressions.tsx";
import {getAreas} from "@/services/areas.tsx";
import {getQuestions} from "@/services/questions-answers.tsx";
import {useQuery} from "@tanstack/react-query";
import {mapRoutingExpressionsToTableRows} from "@/utils/routing-expressions-mapper.ts";
import {RoutingExpressionsTable} from "@/components/ui/routing-expressions-table.tsx";

export function RoutingExpressionsPage() {
    const { data: routingExpressions = [], isLoading: isRoutingExpressionsLoading, error: routingExpressionsError,} = useQuery(
        {
            queryKey: ["routing-expressions"],
            queryFn: getRoutingExpressions,
        })

    const { data: departments = [], isLoading: isDepartmentsLoading, error: departmentsError} = useQuery(
        {
            queryKey: ["departments"],
            queryFn: getDepartments,
        }
    )

    const { data: expressions = [], isLoading: isExpressionsLoading, error: expressionsError} = useQuery(
        {
            queryKey: ["expressions"],
            queryFn: getExpressions,
        }
    )

    const { data: questions = [], isLoading: isQuestionsLoading, error: questionsError} = useQuery(
        {
            queryKey: ["questions"],
            queryFn: getQuestions,
        }
    )

    const { data: areas = [], isLoading: isAreasLoading, error: areasError} = useQuery(
        {
            queryKey: ["areas"],
            queryFn: getAreas,
        }
    )

    const tableData = mapRoutingExpressionsToTableRows(
        routingExpressions,
        expressions,
        areas,
        questions,
        departments
    )

    const isLoading = isRoutingExpressionsLoading || isDepartmentsLoading || isExpressionsLoading || isQuestionsLoading || isAreasLoading
    const error = routingExpressionsError || departmentsError || expressionsError || questionsError || areasError

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

    if (routingExpressions.length === 0) {
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
                <div className={"flex flex-col items-end lg:flex-row lg:justify-end gap-4"}>
                    <Button className={"rounded-sm lg:order-2"} size={"lg"} asChild>
                        <Link to={"/routing-expressions/create"} className={"flex items-center gap-1"}>
                            <IconPlus data-icon={"inline-start"} /> Routing Expression Toevoegen
                        </Link>
                    </Button>
                    <Button className={"rounded-sm lg:order-1"} variant={"secondary"} size={"lg"} asChild>
                        <Link to={"/routing-expressions/simulate"} className={"flex items-center gap-1"}>
                            <IconFlask data-icon={"inline-start"} /> Routing simuleren
                        </Link>
                    </Button>
                </div>
            </div>
            <div className={"py-6"}>
                <RoutingExpressionsTable tableData={tableData} />
            </div>
        </div>
    )
}