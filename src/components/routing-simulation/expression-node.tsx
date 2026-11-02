import {Handle, type NodeProps, Position} from "@xyflow/react"
import { FlowCard } from "./flow-card"
import {HiMiniXMark} from "react-icons/hi2";
import { GoDash } from "react-icons/go";
import {IoMdCheckmark} from "react-icons/io";
import type {SimulationResult} from "@/types/routing-simulations.ts";

type ExpressionNodeData = SimulationResult & {
    isSelected: boolean
}

export function ExpressionNode({ data }: NodeProps) {
    const result = data as ExpressionNodeData
    const borderColor = !result.matches
        ? "border-destructive"
        : result.isSelected
            ? "border-success"
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
                        {result.expression.name}
                    </div>
                }
                className={`border-3 border-solid rounded-lg ${borderColor}`}
            >
                <div className="space-y-2">
                    <div>
                        Order: {result.order}
                    </div>

                    <div className={"flex justify-start items-center"}>
                        Categorie: {result.checks.category
                        ?  <IoMdCheckmark className={"text-2xl text-success"} />
                        : <HiMiniXMark className={"text-2xl text-destructive"} />
                    }
                    </div>

                    <div className={"flex justify-start items-center"}>
                        Gebied: {result.checks.area
                        ?  <IoMdCheckmark className={"text-2xl text-success"} />
                        : <HiMiniXMark className={"text-2xl text-destructive"} />
                    }
                    </div>

                    <div className={"flex justify-start items-center"}>
                        Vraag en/of Antwoord: {result.checks.questionAnswer
                        ?  <IoMdCheckmark className={"text-2xl text-success"} />
                        : <HiMiniXMark className={"text-2xl text-destructive"} />
                    }
                    </div>
                </div>
            </FlowCard>

            <Handle type="source" position={Position.Right}/>
        </>
    )
}