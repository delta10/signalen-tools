import type { InlineCombinatorProps } from "react-querybuilder"
import { Separator } from "@/components/ui/separator"

export function RoutingCombinator({value,}: InlineCombinatorProps) {
    return (
        <div className="flex w-full items-center gap-3 py-2">
            <Separator className="min-w-0 flex-1" />

            <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                {value === "and" ? "EN" : "OF"}
            </span>

            <Separator className="min-w-0 flex-1" />
        </div>
    )
}