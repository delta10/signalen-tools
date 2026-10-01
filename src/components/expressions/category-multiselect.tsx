import type {Category} from "@/types/routing-expressions-create.ts";
import type {useRoutingExpressionForm} from "@/hooks/forms/routing-expressions.ts";
import {useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator} from "@/components/ui/command.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";

type CategoryMultiSelectProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
    groupIndex: number
    categories: Category[]
}

export function CategoryMultiSelect({form, groupIndex, categories}: CategoryMultiSelectProps) {
    const [open, setOpen] = useState(false);

    return(
        <>
            <form.Field name={`conditionGroups[${groupIndex}].values`} mode="array">
                {(field) => {
                    const selectedValues = field.state.value

                    const toggleCategory = (categoryName: string) => {
                        const selectedIndex = selectedValues.indexOf(categoryName)

                        if (selectedIndex === -1) {
                            field.pushValue(categoryName)
                            return
                        }

                        field.removeValue(selectedIndex)
                    }

                    const allSelected = selectedValues.length === categories.length

                    const toggleAllCategories = () => {
                        if (allSelected) {
                            while (field.state.value.length > 0) {
                                field.removeValue(0)
                            }

                            return
                        }

                        categories.forEach((category) => {
                            if (!selectedValues.includes(category.slug)) {
                                field.pushValue(category.slug)
                            }
                        })
                    }

                    return (
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button type="button" variant="outline" className="w-full justify-between">
                                    {selectedValues.length === 0
                                        ? "Selecteer categorieën"
                                        : `${selectedValues.length} categorieën geselecteerd`}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-80 p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Zoek categorie..." />
                                    <CommandList>
                                        <CommandEmpty>
                                            Geen categorieën gevonden.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem value="select-all" onSelect={toggleAllCategories}>
                                                <Checkbox checked={allSelected} className="mr-2" />
                                                Selecteer alle
                                            </CommandItem>

                                            <CommandSeparator />

                                            {categories.map((category) => {
                                                const checked = selectedValues.includes(category.slug)

                                                return (
                                                    <CommandItem
                                                        key={`${category.parent}-${category.slug}`}
                                                        value={category.name}
                                                        onSelect={() => toggleCategory(category.slug)}
                                                    >
                                                        <Checkbox checked={checked} className="mr-2" />
                                                        {category.name}
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