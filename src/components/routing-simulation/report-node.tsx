import {FlowCard} from "@/components/routing-simulation/flow-card.tsx";
import {Handle, type NodeProps, Position} from "@xyflow/react";

type ReportNodeData = {
    title: string
    category: string
    area: string
    question: string
    answer: string
}
export function ReportNode({data}: NodeProps) {
    const nodeData = data as ReportNodeData

    return(
        <>
            <FlowCard title={nodeData.title} className={"border-2 rounded-lg border-green-500"}>
                <div>
                    Categorie: {nodeData.category}
                </div>
                <div>
                    Gebied: {nodeData.area}
                </div>
                <div>
                    Vraag: {nodeData.question}
                </div>
                <div>
                    Antwoord: {nodeData.answer}
                </div>
            </FlowCard>

            <Handle type="source" position={Position.Right}/>
        </>
    )
}