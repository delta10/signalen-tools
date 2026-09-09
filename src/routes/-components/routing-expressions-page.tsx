import {Button} from "@/components/ui/button.tsx";
import {Link} from "@tanstack/react-router";
import { IconPlus } from '@tabler/icons-react';
import { IconFlask } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {getRoutingExpressions} from "@/services/routing-expressions.tsx";
import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {getDepartments} from "@/services/departments.tsx";
import {
    convertDepartmentName,
    convertRoutingExpressionToCategories, getRoutingExpressionAreaName,
    getRoutingExpressionTypes, routingTypeLabels
} from "@/utils/routing-expressions.ts";
import type {Area, Department, Expression, RoutingExpression} from "@/types/routing-expressions.ts";
import {getExpressions} from "@/services/expressions.tsx";
import {ExpandableCategoryList} from "@/components/ui/category-list.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {getAreas} from "@/services/areas.tsx";

export function RoutingExpressionsPage() {
    const [routingExpressions, setRoutingExpressions] = useState<RoutingExpression[]>([]);
    const [departments, setDepartments] = useState<Department[]>([])
    const [expressions, setExpressions] = useState<Expression[]>([])
    const [areas, setAreas] = useState<Area[]>([])

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadRoutingExpressions() {
            const routingData = await getRoutingExpressions()
            const departmentData = await getDepartments()
            const expressionData = await getExpressions()
            const areaData = await getAreas()

            setRoutingExpressions(routingData)
            setDepartments(departmentData)
            setExpressions(expressionData)
            setAreas(areaData)

            setIsLoading(false)
        }

        loadRoutingExpressions()
    }, [])

    if(isLoading) {
        return(
            <Skeleton className={"h-12"} />
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
                        <Link to={"/routing-expressions/test"} className={"flex items-center gap-1"}>
                            <IconFlask data-icon={"inline-start"} /> Routing Testen
                        </Link>
                    </Button>
                </div>
            </div>
            <div className={"py-6"}>
                <Table className={"bg-muted"}>
                    <TableCaption>Routing Expressions</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="rounded-tl-lg">Order</TableHead>
                            <TableHead>Naam</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Categorie</TableHead>
                            <TableHead>Gebied</TableHead>
                            <TableHead>Aanvullende vraag/Antwoord</TableHead>
                            <TableHead>Routering</TableHead>
                            <TableHead className="rounded-tr-lg">Actief</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {routingExpressions.map((routingExpression) => (
                            <TableRow key={routingExpression._expression}>
                                <TableCell>{routingExpression.order}</TableCell>
                                <TableCell>{routingExpression._expression}</TableCell>
                                <TableCell>
                                    {getRoutingExpressionTypes(routingExpression, expressions).map((type) => (
                                        <Badge variant={type} className={"my-2"}>
                                            {routingTypeLabels[type]}
                                        </Badge>
                                    ))}
                                </TableCell>
                                    <ExpandableCategoryList categories={convertRoutingExpressionToCategories(routingExpression, expressions)}/>
                                <TableCell>
                                    {getRoutingExpressionAreaName(routingExpression, expressions, areas) ?? "-"}
                                </TableCell>
                                <TableCell>
                                    {/* Vraag */}
                                </TableCell>
                                <TableCell>
                                    {convertDepartmentName(routingExpression._department, departments)} ({routingExpression._department})
                                </TableCell>
                                <TableCell>
                                    {routingExpression.is_active === "1"
                                        ? <IconCheck className={"text-green-600"} />
                                        : <IconX className={"text-red-600"} />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}