import {Handle, type NodeProps, Position} from "@xyflow/react"
import type { SimulationResult } from "@/types/routing-simulations"
import {FlowCard} from "@/components/routing-simulation/flow-card.tsx";

export function DestinationNode({ data }: NodeProps) {
    const result = data as SimulationResult

    return (
        <>
            <Handle type="target" position={Position.Left}/>
            <FlowCard title={"Gekozen Routeerregel"}>
                <p>{result.routingExpression._expression}</p>
                <p>Order: {result.order}</p>
            </FlowCard>
        </>
    )
}