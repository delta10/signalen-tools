import {Handle, type NodeProps, Position} from "@xyflow/react"
import { FlowCard } from "./flow-card"
import {HiMiniXMark} from "react-icons/hi2";
import { GoDash } from "react-icons/go";
import {IoMdCheckmark} from "react-icons/io";
import type {SimulationResult} from "@/types/routing-simulations.ts";

type ExpressionNodeData = {
    order: number
    routingExpression: {
        _expression: string
    }
    matches: boolean
    isSelected: boolean
    checks: {
        category: boolean
        area: boolean
        questionAnswer: boolean
    }
}

export function ExpressionNode({ data }: NodeProps) {
    const result = data as ExpressionNodeData
    const borderColor = !result.matches
        ? "border-red-600"
        : result.isSelected
            ? "border-green-500"
            : "border-orange-400"

    const statusIcon = !result.matches
        ? <HiMiniXMark className="text-3xl p-1.5 rounded-md bg-secondary" />
        : result.isSelected
            ? <IoMdCheckmark className="text-3xl p-1.5 rounded-md bg-green-200" />
            : <GoDash className="text-3xl p-1.5 rounded-md bg-amber-100" />

    return (
        <>
            <Handle type="target" position={Position.Left}/>

            <FlowCard
                title={
                    <div className="flex items-center gap-2">
                        {statusIcon}
                        {result.routingExpression._expression}
                    </div>
                }
                className={`border-3 border-solid rounded-lg ${borderColor}`}
            >
                <div className="space-y-2">
                    <div>
                        Order: {result.order}
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