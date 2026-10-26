import { useQuery } from "@tanstack/react-query"
import {QueryBuilder, type Field, type RuleGroupType} from "react-querybuilder"
import { getCategories } from "@/services/categories"
import { getAreas } from "@/services/areas"
import type { useRoutingExpressionForm } from "@/hooks/forms/routing-expressions"

type ConditionsBuilderProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
}

export function ConditionsBuilder({ form }: ConditionsBuilderProps) {
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    const { data: areas = [] } = useQuery({
        queryKey: ["areas"],
        queryFn: getAreas,
    })

    const fields: Field[] = [
        {
            name: "category",
            label: "Categorie",
            valueEditorType: "select",
            values: categories.map((category) => ({
                name: category.slug,
                label: category.name,
            })),
        },
        {
            name: "area",
            label: "Gebied",
            valueEditorType: "select",
            values: areas.map((area) => ({
                name: area.code,
                label: area.name,
            })),
        },
    ]

    return (
        <form.Field name="conditions">
            {(field) => (
                <QueryBuilder
                    fields={fields}
                    query={field.state.value as RuleGroupType}
                    onQueryChange={field.handleChange}
                    operators={[
                        { name: "=", label: "is" },
                    ]}
                    combinators={[
                        { name: "and", label: "EN" },
                        { name: "or", label: "OF" },
                    ]}
                />
            )}
        </form.Field>
    )
}