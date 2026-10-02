import {Handle, type NodeProps, Position} from "@xyflow/react"
import { FlowCard } from "./flow-card"
import type {RoutingExpression} from "@/types/routing-expressions.ts";

type ExpressionNodeData = {
    order: number
    routingExpression: RoutingExpression
    matches: boolean
    checks: {
        category: boolean
        area: boolean
        questionAnswer: boolean
    }
}

export function ExpressionNode({ data }: NodeProps) {
    const result = data as ExpressionNodeData

    return (
        <>
            <Handle type="target" position={Position.Left}/>

            <FlowCard title={`Naam: ${result.routingExpression._expression}`}>
                <div className="space-y-2">
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
                    <div>
                        Afdeling: {result.routingExpression._department}
                    </div>
                    <div>
                        Order: {result.order}
                    </div>
                </div>
            </FlowCard>

            <Handle type="source" position={Position.Right}/>
        </>
    )
}