import type {useRoutingExpressionForm} from "@/hooks/forms/routing-expressions.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator} from "@/components/ui/command.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {useState} from "react";

type MultiSelectItem = {
    key: string
    value: string
    label: string
}

type ConditionMultiSelectProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
    groupIndex: number
    items: MultiSelectItem[]
    placeholder: string
    searchPlaceholder: string
    emptyMessage: string
    selectedLabel: string
}

export function ConditionMultiSelect({form, groupIndex, items, placeholder, searchPlaceholder, emptyMessage, selectedLabel}: ConditionMultiSelectProps) {
    const [open, setOpen] = useState(false)

    return (
        <form.Field name={`conditionGroups[${groupIndex}].values`} mode="array">
            {(field) => {
                const selectedValues = field.state.value

                const toggleValue = (value: string) => {
                    const selectedIndex = selectedValues.indexOf(value)

                    // Value not found in selected values, so add it
                    if (selectedIndex === -1) {
                        field.pushValue(value)
                        return
                    }

                    field.removeValue(selectedIndex)
                }

                const allSelected =
                    selectedValues.length === items.length

                const toggleAll = () => {
                    if (allSelected) {
                        while (field.state.value.length > 0) {
                            field.removeValue(0)
                        }

                        return
                    }

                    items.forEach((item) => {
                        if (!selectedValues.includes(item.value)) {
                            field.pushValue(item.value)
                        }
                    })
                }

                return (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="outline" className="w-full justify-between">
                                {selectedValues.length === 0
                                    ? placeholder
                                    : `${selectedValues.length} ${selectedLabel} geselecteerd`}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-80 p-0" align="start">
                            <Command>
                                <CommandInput placeholder={searchPlaceholder}/>

                                <CommandList>
                                    <CommandEmpty>
                                        {emptyMessage}
                                    </CommandEmpty>

                                    <CommandGroup>
                                        <CommandItem value="select-all" onSelect={toggleAll}>
                                            <Checkbox checked={allSelected} className="mr-2"/>
                                            Selecteer alle
                                        </CommandItem>

                                        <CommandSeparator />

                                        {items.map((item) => {
                                            const checked = selectedValues.includes(item.value)

                                            return (
                                                <CommandItem key={item.key} value={item.label}
                                                    onSelect={() =>
                                                        toggleValue(item.value)
                                                    }
                                                >
                                                    <Checkbox checked={checked} className="mr-2"/>
                                                    {item.label}
                                                </CommandItem>
                                            )
                                        })}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )
            }}
        </form.Field>
    )
}