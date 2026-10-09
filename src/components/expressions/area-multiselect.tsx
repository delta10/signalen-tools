import type {useRoutingExpressionForm} from "@/hooks/forms/routing-expressions.ts";
import {ConditionMultiSelect} from "./condition-multiselect";
import type {Area} from "@/types/domain/reference-data.ts";

type AreaMultiSelectProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
    groupIndex: number
    areas: Area[]
}

export function AreaMultiSelect({form, groupIndex, areas}: AreaMultiSelectProps) {
    return (
        <ConditionMultiSelect
            form={form}
            groupIndex={groupIndex}
            items={areas.map((area) => ({
                key: area.code,
                value: area.code,
                label: area.name,
            }))}
            placeholder="Selecteer gebieden"
            searchPlaceholder="Zoek gebied..."
            emptyMessage="Geen gebieden gevonden."
            selectedLabel="gebieden"
        />
    )
}