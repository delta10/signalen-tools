import {FlowCard} from "@/components/routing-simulation/flow-card.tsx";
import {Handle, type NodeProps, Position} from "@xyflow/react";
import {FlowCardField} from "@/components/routing-simulation/flow-card-field.tsx";
import {HiOutlineTag} from "react-icons/hi";
import {HiOutlineMapPin} from "react-icons/hi2";
import {GoCommentDiscussion} from "react-icons/go";
import {MdOutlineQuestionAnswer} from "react-icons/md";

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
            <FlowCard
                title={nodeData.title}
                className="rounded-xl border-2 border-green-500 shadow-sm"
            >
                <div className="space-y-4">
                    <FlowCardField
                        icon={<HiOutlineTag className="size-4" />}
                        label="Categorie"
                        value={nodeData.category}
                    />

                    <FlowCardField
                        icon={<HiOutlineMapPin className="size-4" />}
                        label="Gebied"
                        value={nodeData.area}
                    />

                    <FlowCardField
                        icon={<GoCommentDiscussion className="size-4" />}
                        label="Aanvullende vraag"
                        value={nodeData.question}
                    />

                    <FlowCardField
                        icon={<MdOutlineQuestionAnswer className="size-4" />}
                        label="Antwoord"
                        value={nodeData.answer}
                    />
                </div>
            </FlowCard>

            <Handle type="source" position={Position.Right}/>
        </>
    )
}