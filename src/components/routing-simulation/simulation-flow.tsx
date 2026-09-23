import {Background, ReactFlow} from "@xyflow/react"
import {ExpressionNode} from "@/components/routing-simulation/expression-node.tsx";
import type {RoutingSimulationFormData, SimulationResult} from "@/types/routing-simulations.ts";
import {ReportNode} from "@/components/routing-simulation/report-node.tsx";

const nodeTypes = {
    report: ReportNode,
    expression: ExpressionNode
}

type RoutingSimulationFlowProps = {
    results: SimulationResult[]
    report: RoutingSimulationFormData
}

export function RoutingSimulationFlow({results, report}: RoutingSimulationFlowProps) {
    const matchedResults = results.filter((result) => result.matches)
    const unmatchedResults = results.filter((result) => !result.matches)

    console.log(matchedResults)

    const reportNode = {
        id: "original-report",
        type: "report",
        position: {
            x: -100,
            y: 0,
        },
        data: {
            title: "Jouw melding",
            category: report.category,
            area: report.area,
            question: report.question,
            answer: report.answer,
        },
    }

    const matchedExpressionNodes = matchedResults.map((result, index) => ({
        id: `matched-expression-${index}`,
        type: "expression",
        position: {
            x: 340,
            y: 250 + index * 250,
        },
        data: result,
    }))

    const unmatchedNode = {
        id: "unmatched-expressions",
        type: "unmatched",
        position: {
            x: 700,
            y: 250,
        },
        data: {
            results: unmatchedResults,
        },
    }

    const nodes = [reportNode, ...matchedExpressionNodes, unmatchedNode]

    const edges = results.map((_, index) => ({
        id: `report-expression-${index}`,
        source: "original-report",
        target: `expression-${index}`,
    }))

    return (
        <div className="h-150 w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background />
            </ReactFlow>
        </div>
    )
}