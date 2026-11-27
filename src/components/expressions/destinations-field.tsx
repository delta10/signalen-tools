import type {useRoutingExpressionForm} from "@/hooks/forms/routing-expressions.ts";
import {useQuery} from "@tanstack/react-query";
import {getDepartments} from "@/services/departments.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "@tanstack/react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Input} from "@/components/ui/input.tsx";

type DestinationsFieldProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
}

export function DestinationsField({form}: DestinationsFieldProps) {
    const { data: departments = [], isLoading: isDepartmentsLoading, error: departmentsError,} = useQuery(
        {
            queryKey: ["departments"],
            queryFn: getDepartments,
        })

    if(isDepartmentsLoading) {
        return(
            <Skeleton className={"h-12"} />
        )
    }

    if(departmentsError) {
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

    return(
        <>
            <h2>Dan...</h2>
            <div className={"flex justify-start gap-4"}>
                <form.Field name={"department"}>
                    {(field) => {
                        const selectedDepartment = departments.find(
                            (department) => department.code === field.state.value
                        )

                        return (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                    >
                                        {selectedDepartment?.name ??
                                            "Selecteer afdeling"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {departments.map((department) => (
                                        <DropdownMenuItem
                                            key={department.code}
                                            onSelect={() =>
                                                field.handleChange(department.code)
                                            }
                                        >
                                            {department.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    }}
                </form.Field>
                <form.Field name="user">
                    {(field) => (
                        <div className="space-y-2 min-w-60">
                            <Input
                                id={field.name}
                                type="email"
                                placeholder="naam@organisatie.nl (optioneel)"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                        </div>
                    )}
                </form.Field>
            </div>
        </>
    )
}