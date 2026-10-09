import {Background, MarkerType, ReactFlow} from "@xyflow/react"
import {ExpressionNode} from "@/components/routing-simulation/expression-node.tsx";
import type {RoutingSimulationFormData, SimulationResult} from "@/types/routing-simulations.ts";
import {ReportNode} from "@/components/routing-simulation/report-node.tsx";
import {DestinationNode} from "@/components/routing-simulation/destination-node.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";

const nodeTypes = {
    report: ReportNode,
    expression: ExpressionNode,
    destination: DestinationNode
}

type RoutingSimulationFlowProps = {
    results: SimulationResult[]
    report: RoutingSimulationFormData
    selectedRoutingExpression: SimulationResult | null
}

export function RoutingSimulationFlow({results, report, selectedRoutingExpression}: RoutingSimulationFlowProps) {
    const [showUnmatched, setShowUnmatched] = useState(false)

    const visibleResults = showUnmatched
        ? results
        : results.filter((result) => result.matches)

    {/* Create all nodes */}
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

    const expressionNodes = visibleResults.map((result, index) => ({
        id: `expression-${result.routingExpression._expression}-${result.order}`,
        type: "expression",
        position: {
            x: 340,
            y: index * 250,
        },
        data: result,
    }))

    const destinationNode = selectedRoutingExpression ? {
            id: "destination-node",
            type: "destination",
            position: {
                x: 780,
                y: 250,
            },
            data: selectedRoutingExpression,
        } : null

    {/* Create connections between nodes */}
    const matchingExpressionNodes = expressionNodes.filter(
        (node) => node.data.matches
    )

    const reportEdges = matchingExpressionNodes.map((node) => ({
        id: `report-${node.id}`,
        source: "original-report",
        target: node.id,
        type: "smoothstep",
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#000"
        },
        style: {
            stroke: "#000",
            strokeWidth: 2
        }
    }))

    const selectedExpressionNode = expressionNodes.find(
        (node) =>
            node.data.routingExpression._expression ===
            selectedRoutingExpression?.routingExpression._expression &&
            node.data.order === selectedRoutingExpression?.order
    )

    const destinationEdge =
        selectedExpressionNode && destinationNode ? {
                id: "selected-destination",
                source: selectedExpressionNode.id,
                target: destinationNode.id,
                type: "smoothstep",
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: "#000"
                },
                style: {
                    stroke: "#000",
                    strokeWidth: 2
                },
            } : null

    {/* Define nodes + edges */}
    const nodes = [
        reportNode,
        ...expressionNodes,
        ...(destinationNode ? [destinationNode] : [])
    ]

    const edges = [
        ...reportEdges,
        ...(destinationEdge ? [destinationEdge] : []),
    ]

    return (
        <>
            <Button variant="secondary" onClick={() => setShowUnmatched((current) => !current)}>
                {showUnmatched
                    ? "Verberg niet-matchende regels"
                    : "Toon niet-matchende regels"}
            </Button>
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
        </>
    )
}