import { useState } from "react"
import { IconCheck, IconSelector } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command"

type SearchableOption = {
    value: string
    label: string
    searchTerms?: string
}

type SearchableMultiSelectProps = {
    options: SearchableOption[]
    value: string[]
    onChange: (values: string[]) => void
    placeholder: string
    searchPlaceholder: string
    disabled?: boolean
}

export function SearchableMultiSelect({options, value, onChange, placeholder, searchPlaceholder, disabled = false,}: SearchableMultiSelectProps) {
    const [open, setOpen] = useState(false)

    function toggleValue(selectedValue: string) {
        if (value.includes(selectedValue)) {
            onChange(value.filter((v) => v !== selectedValue))
        } else {
            onChange([...value, selectedValue])
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className="w-full max-w-md min-w-0 justify-between"
                >
                    <span className="truncate">
                        {value.length === 0
                            ? placeholder
                            : `${value.length} gebieden geselecteerd`}
                    </span>
                    <IconSelector
                        size={16}
                        className="shrink-0 opacity-50"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>
                            Geen resultaten gevonden.
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const selected = value.includes(option.value)

                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={`${option.label} ${option.searchTerms ?? ""}`}
                                        onSelect={() => toggleValue(option.value)}
                                    >
                                        <IconCheck
                                            size={16}
                                            className={
                                                selected
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }
                                        />
                                        {option.label}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}