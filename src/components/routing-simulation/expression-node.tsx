import { Handle, type NodeProps, Position } from "@xyflow/react"
import { HiMiniXMark } from "react-icons/hi2"
import { GoDash } from "react-icons/go"
import { IoMdCheckmark } from "react-icons/io"
import { FlowCard } from "./flow-card"
import type { SimulationResult } from "@/types/routing-simulations"

type ExpressionNodeData = SimulationResult & {
    isSelected: boolean
}

export function ExpressionNode({ data }: NodeProps) {
    const result = data as ExpressionNodeData

    const borderColor = !result.matches
        ? "border-red-600"
        : result.isSelected
            ? "border-green-500"
            : "border-orange-400"

    const status = !result.matches
        ? "Geen match"
        : result.isSelected
            ? "Gekozen"
            : "Match, niet gekozen"

    const statusIcon = !result.matches
        ? <HiMiniXMark className="size-5" />
        : result.isSelected
            ? <IoMdCheckmark className="size-5" />
            : <GoDash className="size-5" />

    const statusBackground = !result.matches
        ? "bg-red-100 text-red-700"
        : result.isSelected
            ? "bg-green-100 text-green-700"
            : "bg-amber-100 text-amber-700"

    const checks = [
        { label: "Categorie", matches: result.checks.category },
        { label: "Gebied", matches: result.checks.area },
        {
            label: "Vraag / antwoord",
            matches: result.checks.questionAnswer,
        },
    ]

    return (
        <>
            <Handle type="target" position={Position.Left} />

            <FlowCard
                title={
                    <div className="flex items-center gap-3">
                        <span className={`shrink-0 rounded-md p-2 ${statusBackground}`}>
                            {statusIcon}
                        </span>

                        <div className="min-w-0 space-y-1">
                            <p className="wrap-break-word font-semibold">
                                {result.expression.name}
                            </p>
                            <p className="text-xs font-normal text-muted-foreground">
                                {status}
                            </p>
                        </div>
                    </div>
                }
                className={`rounded-xl border-2 bg-card shadow-sm ${borderColor}`}
            >
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-muted-foreground">
                            Prioriteit
                        </span>

                        <span className="text-sm font-semibold">
                            {result.order}
                        </span>
                    </div>

                    <div className="border-t pt-3">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                            Voorwaarden
                        </p>

                        <div className="space-y-2">
                            {checks.map(check => (
                                <div
                                    key={check.label}
                                    className="flex items-center justify-between gap-4"
                                >
                                    <span className="text-sm">
                                        {check.label}
                                    </span>

                                    <span
                                        className={
                                            check.matches
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }
                                    >
                                        {check.matches ? (
                                            <IoMdCheckmark className="size-4" />
                                        ) : (
                                            <HiMiniXMark className="size-4" />
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </FlowCard>

            <Handle type="source" position={Position.Right} />
        </>
    )
}
