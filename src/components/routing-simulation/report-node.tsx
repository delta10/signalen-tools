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
            <FlowCard title={nodeData.title}>
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

            <Handle
                type="source"
                position={Position.Bottom}
            />
        </>
    )
}