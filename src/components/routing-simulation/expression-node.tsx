import { Handle, type NodeProps, Position } from "@xyflow/react"
import { FlowCard } from "./flow-card"
import type { SimulationResult } from "@/types/routing-simulations"

export function ExpressionNode({ data }: NodeProps) {
    const result = data as SimulationResult

    return (
        <>
            <Handle type="target" position={Position.Left} />
            <FlowCard title={result.expression.name}>
                <div className="space-y-2">
                    <div>
                        Volgorde: {result.order}
                    </div>

                    <div>
                        Routering: {result.matches
                        ? "Komt overeen"
                        : "Komt niet overeen"}
                    </div>
                </div>
            </FlowCard>
            <Handle type="source" position={Position.Right} />
        </>
    )
}