import { useState } from "react"
import { HiChevronDown, HiChevronUp, HiXCircle } from "react-icons/hi2"
import { Button } from "@/components/ui/button"
import type { SimulationResult } from "@/types/routing-simulations"

type UnmatchedPanelProps = {
    results: SimulationResult[]
}

export function UnmatchedPanel({ results }: UnmatchedPanelProps) {
    const [expanded, setExpanded] = useState(false)

    if (results.length === 0) return null

    return (
        <div className="w-full rounded-lg border bg-card shadow-md">
            <Button
                type="button"
                variant="ghost"
                onClick={() => setExpanded(prev => !prev)}
                aria-expanded={expanded}
                className="flex h-auto w-full items-center justify-between gap-4 rounded-lg px-4 py-3"
            >
                <span className="flex items-center gap-2">
                    <HiXCircle className="size-5 text-red-500" />

                    <span className="font-medium">
                        Niet-gematchte routeerregels
                    </span>

                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs">
                        {results.length}
                    </span>
                </span>

                {expanded
                    ? <HiChevronUp className="size-4" />
                    : <HiChevronDown className="size-4" />
                }
            </Button>

            {expanded && (
                <div className="max-h-64 space-y-2 overflow-y-auto border-t p-3">
                    {results.map((result, index) => (
                        <div
                            key={`${result.expression.id}-${index}`}
                            className="rounded-md border border-red-200 bg-red-50/50 p-3"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium">
                                    {result.expression.name}
                                </span>

                                <span className="shrink-0 text-xs text-muted-foreground">
                                    Prioriteit {result.order}
                                </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span>
                                    Categorie: {result.checks.category ? "✓" : "✕"}
                                </span>
                                <span>
                                    Gebied: {result.checks.area ? "✓" : "✕"}
                                </span>
                                <span>
                                    Vraag/antwoord: {result.checks.questionAnswer ? "✓" : "✕"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
