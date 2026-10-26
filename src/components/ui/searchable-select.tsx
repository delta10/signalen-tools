import { useState } from "react"
import { IconCheck, IconSelector } from "@tabler/icons-react"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

export type SearchableOption = {
    value: string
    label: string
    searchTerms?: string
}

type SearchableSelectProps = {
    options: SearchableOption[]
    value: string
    onChange: (value: string) => void
    placeholder: string
    searchPlaceholder: string
    disabled?: boolean
}

export function SearchableSelect({options, value, onChange, placeholder, searchPlaceholder, disabled = false,}: SearchableSelectProps) {
    const [open, setOpen] = useState(false)

    const selectedOption = options.find(
        (option) => option.value === value
    )

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
                        {selectedOption?.label ?? placeholder}
                    </span>
                    <IconSelector size={16} className="shrink-0 opacity-50" />
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
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={`${option.label} ${option.searchTerms ?? ""}`}
                                    onSelect={() => {
                                        onChange(option.value)
                                        setOpen(false)
                                    }}
                                >
                                    <IconCheck
                                        size={16}
                                        className={
                                            value === option.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }
                                    />

                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}