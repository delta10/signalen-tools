import { ChevronDown, ChevronUp } from "lucide-react"
import type { NodeProps } from "@xyflow/react"

type UnmatchedGroupNodeData = {
    count: number
    expanded: boolean
    onToggle: () => void
}

export function UnmatchedGroupNode({ data }: NodeProps) {
    const { count, expanded, onToggle } =
        data as UnmatchedGroupNodeData

    return (
        <div className="h-full w-full rounded-lg border-2 border-secondary bg-background p-4">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4"
            >
                <span className="font-medium">
                    Niet-gematchte routeerregels ({count})
                </span>

                {expanded
                    ? <ChevronUp />
                    : <ChevronDown />
                }
            </button>
        </div>
    )
}