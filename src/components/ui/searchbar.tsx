import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command"
import type {Department, Expression, RoutingExpression} from "@/types/routing-expressions.ts";
import {useState} from "react";
import {getDepartmentName, getRoutingExpressionCategories} from "@/utils/routing-expressions.ts";

type SearchbarProps = {
    routingExpressions: RoutingExpression[]
    expressions: Expression[]
    departments: Department[]
}

export function Searchbar({routingExpressions, expressions, departments}: SearchbarProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const showSuggestions = searchQuery.trim().length >= 2

    const names = [
        ...new Set(
            routingExpressions.map(
                (routingExpression) => routingExpression._expression
            )
        ),
    ]

    const categories = [
        ...new Set(
            routingExpressions.flatMap((routingExpression) =>
                getRoutingExpressionCategories(routingExpression, expressions)
            )
        ),
    ]

    const departmentsList = [
        ...new Set(
            routingExpressions.map((routingExpression) =>
                getDepartmentName(routingExpression._department, departments)
            )
        ),
    ]

    return(
        <div className="relative w-full max-w-md">
            <Command>
                <CommandInput
                    placeholder="Zoek op naam, categorie etc."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                />
                {showSuggestions && (
                    <CommandList className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                        <CommandEmpty>Geen resultaten gevonden</CommandEmpty>
                        <CommandGroup heading="Naam">
                            {names.map((name) => (
                                <CommandItem
                                    key={`name-${name}`}
                                    value={name}
                                >
                                    {name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandGroup heading="Categorieën">
                            {categories.map((category) => (
                                    <CommandItem
                                        key={`category-${category}`}
                                        value={category}
                                    >
                                        {category}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                        <CommandGroup heading="Routering">
                            {departmentsList.map((department) => (
                                    <CommandItem
                                        key={department}
                                        value={department}
                                    >
                                        {department}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                )}
            </Command>
        </div>
    )
}