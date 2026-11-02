import {Handle, type NodeProps, Position} from "@xyflow/react"
import type { SimulationResult } from "@/types/routing-simulations"
import {FlowCard} from "@/components/routing-simulation/flow-card.tsx";

export function DestinationNode({ data }: NodeProps) {
    const result = data as SimulationResult

    return (
        <>
            <Handle type="target" position={Position.Left}/>
            <FlowCard
                title={result.expression.routing?.department.name ?? "Onbekende afdeling"}
                className="border-2 rounded-lg border-success"
            >
                <p>Routeerregel: {result.expression.name}</p>
                <p>Order: {result.order}</p>
            </FlowCard>
        </>
    )
}