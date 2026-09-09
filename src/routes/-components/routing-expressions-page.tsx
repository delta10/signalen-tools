import {Button} from "@/components/ui/button.tsx";
import {Link} from "@tanstack/react-router";
import { IconPlus } from '@tabler/icons-react';
import { IconFlask } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {getRoutingExpressions, type RoutingExpression} from "@/services/routing-expressions.tsx";
import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {type Department, getDepartments} from "@/services/departments.tsx";

export function RoutingExpressionsPage() {
    const [routingExpressions, setRoutingExpressions] = useState<RoutingExpression[]>([]);
    const [departments, setDepartments] = useState<Department[]>([])
    const [isLoading, setIsLoading] = useState(true);

    {/* Helper function for decoding department name */}
    function convertDepartmentName(departmentCode: string, departments: Department[]) {
        const department = departments.find(
            (department) => department.code === departmentCode
        )

        return department?.name ?? departmentCode
    }

    useEffect(() => {
        async function loadRoutingExpressions() {
            const routingData = await getRoutingExpressions()
            const departmentData = await getDepartments();

            setRoutingExpressions(routingData)
            setDepartments(departmentData)
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
                                    {/* Types */}
                                </TableCell>

                                <TableCell>
                                    {/* Categorieen */}
                                </TableCell>

                                <TableCell>
                                    {/* Gebieden */}
                                </TableCell>

                                <TableCell>
                                    {/* Vraag */}
                                </TableCell>

                                <TableCell>
                                    {convertDepartmentName(routingExpression._department, departments)}
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