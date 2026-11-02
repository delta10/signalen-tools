import { Handle, type NodeProps, Position } from "@xyflow/react"
import { FlowCard } from "./flow-card"
import type { SimulationResult } from "@/types/routing-simulations"
import {GiChoice} from "react-icons/gi";

export function DestinationNode({ data }: NodeProps) {
    const result = data as SimulationResult

    const department = result.expression.routing?.department.name ?? "Onbekende afdeling"

    return (
        <>
            <Handle type="target" position={Position.Left} />

            <FlowCard
                title={
                    <div className="flex items-center gap-3">
                        <span className="shrink-0 rounded-md bg-green-100 p-2 text-green-700">
                            <GiChoice className={"size-5"} />
                        </span>

                        <div className="min-w-0 space-y-1">
                            <p className="text-xs font-normal text-muted-foreground">
                                Gekozen bestemming
                            </p>
                            <p className="wrap-break-word font-semibold">
                                {department}
                            </p>
                        </div>
                    </div>
                }
                className="rounded-xl border-2 border-green-500 bg-card shadow-sm"
            >
                <div className="space-y-3">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                            Via routeerregel
                        </p>

                        <p className="text-sm font-medium">
                            {result.expression.name}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t pt-3">
                        <span className="text-sm text-muted-foreground">
                            Prioriteit
                        </span>

                        <span className="text-sm font-semibold">
                            {result.order}
                        </span>
                    </div>
                </div>
            </FlowCard>
        </>
    )
}
