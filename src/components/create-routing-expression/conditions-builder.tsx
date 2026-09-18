import type {useRoutingExpressionForm} from "@/hooks/use-routing-expressions-form.ts";
import {Button} from "@/components/ui/button.tsx";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";
import type {ConditionType} from "@/types/routing-expressions-create.ts";
import {useQuery} from "@tanstack/react-query";
import {getCategories} from "@/services/categories.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Link} from "@tanstack/react-router";

type ConditionsProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
}

const conditionTypeLabels: Record<ConditionType, string> = {
    category: "Categorie",
    area: "Gebied",
    question: "Aanvullende vraag",
}

const conditionTypes = Object.entries(conditionTypeLabels) as [ConditionType, string][]

export function ConditionsBuilder({form}: ConditionsProps) {
    const { data: categories = [], isLoading: isCategoriesLoading, error: categoriesError,} = useQuery(
        {
            queryKey: ["categories"],
            queryFn: getCategories,
        })

    if(isCategoriesLoading) {
        return(
            <Skeleton className={"h-12"} />
        )
    }

    if(categoriesError) {
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
        <form.Field name="conditions" mode="array">
            {(field) => (
                <div className="flex flex-col gap-4">
                    {field.state.value.map((condition, index) => (
                        <form.Field name={`conditions[${index}].type`}>
                            {(typeField) => (
                                <>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button type="button" variant="outline">
                                                {typeField.state.value
                                                    ? conditionTypeLabels[typeField.state.value]
                                                    : "Selecteer een type"}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {conditionTypes.map(([value, label]) => (
                                                <DropdownMenuItem
                                                    key={value}
                                                    onSelect={() =>
                                                        typeField.handleChange(value)
                                                    }>
                                                    {label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {typeField.state.value === "category" && (
                                        <form.Field name={`conditions[${index}].categories`} mode="array">
                                            {(categoryField) => (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button type="button" variant="outline">
                                                            {categoryField.state.value.length > 0
                                                                ? categoryField.state.value.join(", ")
                                                                : "Selecteer categorie"}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        {categories.map((category) => (
                                                            <DropdownMenuItem
                                                                key={`${category.parent}-${category.slug}`}
                                                                onSelect={() => {
                                                                    categoryField.pushValue(category.name)
                                                                }}>
                                                                {category.name}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </form.Field>
                                    )}

                                    {typeField.state.value === "area" && (
                                        <div>
                                            Gebied selectie komt hier
                                        </div>
                                    )}

                                    {typeField.state.value === "question" && (
                                        <div>
                                            Vraag selectie komt hier
                                        </div>
                                    )}
                                </>
                            )}
                        </form.Field>
                    ))}
                    <Button type="button" variant="secondary" onClick={() =>
                            field.pushValue({
                                id: crypto.randomUUID(),
                                type: "",
                                categories: [],
                            })
                        }>
                        + Voorwaarde toevoegen
                    </Button>
                </div>
            )}
        </form.Field>
    )
}