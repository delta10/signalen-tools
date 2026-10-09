import type {Category} from "@/types/routing-expressions-create.ts";
import type {useRoutingExpressionForm} from "@/hooks/forms/routing-expressions.ts";
import {ConditionMultiSelect} from "./condition-multiselect";

type CategoryMultiSelectProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
    groupIndex: number
    categories: Category[]
}

export function CategoryMultiSelect({form, groupIndex, categories}: CategoryMultiSelectProps) {
    return (
        <ConditionMultiSelect
            form={form}
            groupIndex={groupIndex}
            items={categories.map((category) => ({
                key: `${category.parent}-${category.slug}`,
                value: category.name,
                label: category.name
            }))}
            placeholder="Selecteer categorieën"
            searchPlaceholder="Zoek categorie..."
            emptyMessage="Geen categorieën gevonden."
            selectedLabel="categorieën"
        />
    )
}