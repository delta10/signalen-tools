import { useState } from "react"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

type CategoryPreviewProps = {
    categories: string[]
}

export function CategoryPreview({ categories }: CategoryPreviewProps) {
    const [search, setSearch] = useState("")

    const visibleCategories = categories.slice(0, 3)
    const remainingCount = categories.length - 3

    const filteredCategories = categories.filter((category) =>
        category.toLowerCase().includes(search.toLowerCase())
    )

    if (categories.length === 0) return <span>-</span>

    return (
        <div className="text-sm">
            {visibleCategories.join(", ")}

            {remainingCount > 0 && (
                <Popover modal={true} onOpenChange={(open) => {
                    if (!open) setSearch("")
                }}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="ml-1 text-primary hover:underline"
                        >
                            +{remainingCount} meer
                        </button>
                    </PopoverTrigger>

                    <PopoverContent
                        className="w-72 space-y-3"
                        align="start"
                        side="bottom"
                        collisionPadding={16}
                    >
                        <p className="text-sm font-medium">
                            Alle categorieën ({categories.length})
                        </p>

                        <Input
                            placeholder="Zoek categorie..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <ScrollArea className="h-48">
                            <div className="space-y-2 pr-3">
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((category, index) => (
                                        <div
                                            key={`${category}-${index}`}
                                            className="text-sm"
                                        >
                                            {category}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Geen categorieën gevonden.
                                    </p>
                                )}
                            </div>
                        </ScrollArea>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
}