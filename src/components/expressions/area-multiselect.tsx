import type {useRoutingExpressionForm} from "@/hooks/forms/routing-expressions.ts";
import type {Area} from "@/types/routing-expressions.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator} from "@/components/ui/command.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {useState} from "react";

type AreaMultiSelectProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
    groupIndex: number
    areas: Area[]
}

export function AreaMultiSelect({form, groupIndex, areas}: AreaMultiSelectProps) {
    const [open, setOpen] = useState(false)

    return(
        <>
            <form.Field name={`conditionGroups[${groupIndex}].values`} mode="array">
                {(field) => {
                    const selectedValues = field.state.value

                    const toggleArea = (areaCode: string) => {
                        const selectedIndex =
                            selectedValues.indexOf(areaCode)

                        if (selectedIndex === -1) {
                            field.pushValue(areaCode)
                            return
                        }

                        field.removeValue(selectedIndex)
                    }

                    const allSelected = selectedValues.length === areas.length

                    const toggleAllAreas = () => {
                        if (allSelected) {
                            while (field.state.value.length > 0) {
                                field.removeValue(0)
                            }

                            return
                        }

                        areas.forEach((area) => {
                            if (!selectedValues.includes(area.name)) {
                                field.pushValue(area.name)
                            }
                        })
                    }
                    return (
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button type="button" variant="outline" className="w-full justify-between">
                                    {selectedValues.length === 0
                                        ? "Selecteer gebieden"
                                        : `${selectedValues.length} gebieden geselecteerd`}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-80 p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Zoek gebied..." />
                                    <CommandList>
                                        <CommandEmpty>
                                            Geen categorieën gevonden.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem value="select-all" onSelect={toggleAllAreas}>
                                                <Checkbox checked={allSelected} className="mr-2" />
                                                Selecteer alle
                                            </CommandItem>

                                            <CommandSeparator />

                                            {areas.map((area) => {
                                                const checked = selectedValues.includes(area.name)

                                                return (
                                                    <CommandItem
                                                        key={area.code}
                                                        value={area.name}
                                                        onSelect={() => toggleArea(area.name)}
                                                    >
                                                        <Checkbox checked={checked} className="mr-2" />
                                                        {area.name}
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
        </>
    )
}