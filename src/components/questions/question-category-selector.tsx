import { useState } from "react"
import type { Category } from "@/types/domain/reference-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {Popover, PopoverTrigger, PopoverContent,} from "@/components/ui/popover"
import {IconCheck, IconChevronDown, IconX,} from "@tabler/icons-react"

type QuestionCategorySelectorProps = {
    categories: Category[]
    selectedIds: number[]
    onChange: (ids: number[]) => void
}

export function QuestionCategorySelector({categories, selectedIds, onChange,}: QuestionCategorySelectorProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")

    const filteredCategories = categories.filter(category =>
        `${category.name} ${category.slug}`
            .toLowerCase()
            .includes(search.toLowerCase().trim())
    )

    function toggleCategory(id: number) {
        onChange(
            selectedIds.includes(id)
                ? selectedIds.filter(selectedId => selectedId !== id)
                : [...selectedIds, id]
        )
    }

    const selectedCategories = categories.filter(category =>
        selectedIds.includes(category.id)
    )

    return (
        <div className="flex min-w-0 flex-col gap-3">
            <div>
                <h3 className="font-medium">Categorieën</h3>
                <p className="text-sm text-muted-foreground">
                    Selecteer de categorieën waarbij deze vraag hoort.
                </p>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        aria-expanded={open}
                        aria-label="Categorieën selecteren"
                        className="w-full max-w-md justify-between"
                    >
                        <span className="truncate">
                            {selectedIds.length === 0
                                ? "Selecteer categorieën..."
                                : `${selectedIds.length} categorieën geselecteerd`}
                        </span>

                        <IconChevronDown className="size-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-2">
                    <Input
                        placeholder="Zoek categorieën..."
                        aria-label="Categorieën zoeken"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        className="mb-2"
                    />

                    <div className="max-h-60 space-y-1 overflow-y-auto">
                        {filteredCategories.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                Geen categorieën gevonden.
                            </p>
                        ) : (
                            filteredCategories.map(category => {
                                const selected = selectedIds.includes(category.id)

                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() => toggleCategory(category.id)}
                                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                                    >
                                        <IconCheck
                                            className={
                                                selected
                                                    ? "size-4 shrink-0 opacity-100"
                                                    : "size-4 shrink-0 opacity-0"
                                            }
                                        />

                                        <span className="min-w-0 flex-1">
                                            {category.name}
                                        </span>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {selectedCategories.length > 0 && (
                <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                    {selectedCategories.map(category => (
                        <Badge
                            key={category.id}
                            variant="secondary"
                            className="gap-1"
                        >
                            {category.name}

                            <button
                                type="button"
                                onClick={() => toggleCategory(category.id)}
                            >
                                <IconX size={12} />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}
