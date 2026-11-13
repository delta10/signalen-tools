import {Handle, type NodeProps, Position} from "@xyflow/react"
import { FlowCard } from "./flow-card"
import type {SimulationResult} from "@/types/routing-simulations.ts";

export function ExpressionNode({ data }: NodeProps) {
    const result = data as SimulationResult

    return (
        <>
            <Handle type="target" position={Position.Left}/>

            <FlowCard title={result.expression.name}>
                <div className="space-y-2">
                    <div>
                        Order: {result.order}
                    </div>
                    <div>
                        Match: {result.matches ? "JA" : "NEE"}
                    </div>

                    <div>
                        Categorie: {result.checks.category ? "✓" : "✕"}
                    </div>

                    <div>
                        Gebied: {result.checks.area ? "✓" : "✕"}
                    </div>

                    <div>
                        Vraag/antwoord:{" "}
                        {result.checks.questionAnswer ? "✓" : "✕"}
                    </div>
                </div>
            </FlowCard>

            <Handle type="source" position={Position.Right}/>
        </>
    )
}