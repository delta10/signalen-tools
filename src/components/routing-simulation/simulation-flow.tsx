import { Background, MarkerType, ReactFlow } from "@xyflow/react"
import { useState } from "react"
import { ExpressionNode } from "@/components/routing-simulation/expression-node.tsx"
import { ReportNode } from "@/components/routing-simulation/report-node.tsx"
import { DestinationNode } from "@/components/routing-simulation/destination-node.tsx"
import { UnmatchedGroupNode } from "@/components/routing-simulation/unmatched-group-node.tsx"
import type {RoutingSimulationFormData, SimulationResult,} from "@/types/routing-simulations.ts"

const nodeTypes = {
    report: ReportNode,
    expression: ExpressionNode,
    destination: DestinationNode,
    unmatchedGroup: UnmatchedGroupNode,
}

type RoutingSimulationFlowProps = {
    results: SimulationResult[]
    report: RoutingSimulationFormData
    selectedRoutingExpression: SimulationResult | null
}

export function RoutingSimulationFlow({results, report, selectedRoutingExpression,}: RoutingSimulationFlowProps) {
    const [showUnmatched, setShowUnmatched] = useState(false)
    const matchedResults = results.filter(result => result.matches)
    const unmatchedResults = results.filter(result => !result.matches)

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

    const expressionNodes = matchedResults.map((result, index) => ({
        id: `expression-${result.expression.name}-${result.order}`,
        type: "expression",
        position: {
            x: 340,
            y: index * 250,
        },
        data: {
            ...result,
            isSelected:
                result.expression.name ===
                selectedRoutingExpression?.expression.name &&
                result.order === selectedRoutingExpression?.order,
        },
    }))

    const groupNode = {
        id: "unmatched-group",
        type: "unmatchedGroup",
        position: {
            x: 340,
            y: matchedResults.length * 250 + 50,
        },
        style: {
            width: 350,
            height: showUnmatched
                ? 100 + unmatchedResults.length * 250
                : 75,
        },
        data: {
            count: unmatchedResults.length,
            expanded: showUnmatched,
            onToggle: () => setShowUnmatched(prev => !prev),
        },
    }

    const unmatchedNodes = showUnmatched
        ? unmatchedResults.map((result, index) => ({
            id: `unmatched-${result.expression.name}-${result.order}`,
            type: "expression",
            parentId: "unmatched-group",
            extent: "parent" as const,
            draggable: false,
            position: {
                x: 20,
                y: 80 + index * 250,
            },
            data: {
                ...result,
                isSelected: false,
            },
        }))
        : []

    const destinationNode = selectedRoutingExpression
        ? {
            id: "destination-node",
            type: "destination",
            position: {
                x: 780,
                y: 250,
            },
            data: selectedRoutingExpression,
        }
        : null

    {/* Create Edges */}
    const reportEdges = expressionNodes.map(node => {
        const color = node.data.isSelected
            ? "#16a34a"
            : "#fb923c"

        return {
            id: `report-${node.id}`,
            source: "original-report",
            target: node.id,
            type: "smoothstep",
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color,
            },
            style: {
                stroke: color,
                strokeWidth: 2,
            },
        }
    })

    const selectedExpressionNode = expressionNodes.find(
        node => node.data.isSelected
    )

    const destinationEdge =
        selectedExpressionNode && destinationNode
            ? {
                id: "selected-destination",
                source: selectedExpressionNode.id,
                target: destinationNode.id,
                type: "smoothstep",
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: "#16a34a",
                },
                style: {
                    stroke: "#16a34a",
                    strokeWidth: 2,
                },
            }
            : null

    {/* Define nodes + edges */}
    const nodes = [
        reportNode,
        ...expressionNodes,
        ...(unmatchedResults.length > 0 ? [groupNode] : []),
        ...unmatchedNodes,
        ...(destinationNode ? [destinationNode] : []),
    ]

    const edges = [
        ...reportEdges,
        ...(destinationEdge ? [destinationEdge] : []),
    ]

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