import { describe, expect, it } from "vitest"
import {doesCategoryMatch, doesAreaMatch, doesQuestionAnswerMatch, simulateRouting, getSelectedRoutingExpression,} from "@/utils/routing-simulations.ts"
import type { Expression } from "@/types/domain/routing"
import type {Area, Category, Question,} from "@/types/domain/reference-data"
import type { RoutingSimulationData } from "@/types/routing-simulations"

describe("Routing simulation", () => {
    const expression: Expression = {
        id: 1,
        name: "Straatverlichting Uden",
        code:
            'sub == "Straatverlichting" and ' +
            'location in areas."district"."WK199101"',
        type: "routing",
        isActive: true,
        routing: {
            department: {
                id: 1,
                code: "VER",
                name: "Verlichting",
                isIntern: true,
            },
            order: 10,
        },
    }

    const simulationData: RoutingSimulationData = {
        category: "straatverlichting",
        area: "WK199101",
        question: "",
        answer: "",
    }

    const categories = [
        {
            id: 1,
            slug: "straatverlichting",
            name: "Straatverlichting",
        },
    ] satisfies Category[]

    const areas = [
        {
            id: 1,
            code: "WK199101",
            name: "Uden",
            type: {
                id: 1,
                code: "district",
                name: "district",
            },
        },
    ] satisfies Area[]

    const questions: Question[] = []

    describe("doesCategoryMatch", () => {
        it("returns true when the category matches", () => {
            expect(
                doesCategoryMatch(simulationData, expression, categories)
            ).toBe(true)
        })

        it("returns false when the category does not match", () => {
            expect(
                doesCategoryMatch(
                    { ...simulationData, category: "afvalbak" },
                    expression,
                    categories
                )
            ).toBe(false)
        })

        it("returns true when the expression has no category condition", () => {
            const expressionWithoutCategory = {
                ...expression,
                code: 'location in areas."district"."WK199101"',
            }

            expect(
                doesCategoryMatch(
                    simulationData,
                    expressionWithoutCategory,
                    categories
                )
            ).toBe(true)
        })
    })

    describe("doesAreaMatch", () => {
        it("returns true when the area matches", () => {
            expect(
                doesAreaMatch(simulationData, expression, areas)
            ).toBe(true)
        })

        it("returns false when the area does not match", () => {
            expect(
                doesAreaMatch(
                    { ...simulationData, area: "WK199102" },
                    expression,
                    areas
                )
            ).toBe(false)
        })
    })

    describe("doesQuestionAnswerMatch", () => {
        it("returns true when there are no question conditions", () => {
            expect(
                doesQuestionAnswerMatch(
                    simulationData,
                    expression,
                    questions
                )
            ).toBe(true)
        })
    })

    describe("simulateRouting", () => {
        it("returns a matching result when all conditions match", () => {
            const results = simulateRouting(
                simulationData,
                [expression],
                categories,
                areas,
                questions
            )

            expect(results[0]).toMatchObject({
                expression,
                order: 10,
                matches: true,
                checks: {
                    category: true,
                    area: true,
                    questionAnswer: true,
                },
            })
        })

        it("excludes expressions without routing", () => {
            const expressionWithoutRouting = {
                ...expression,
                routing: null,
            }

            const results = simulateRouting(
                simulationData,
                [expressionWithoutRouting],
                categories,
                areas,
                questions
            )

            expect(results).toEqual([])
        })
    })

    describe("getSelectedRoutingExpression", () => {
        it("selects the matching expression with the lowest order", () => {
            const higherPriority: Expression = {
                ...expression,
                id: 2,
                name: "Higher priority",
                routing: {
                    ...expression.routing!,
                    order: 1,
                },
            }

            const results = simulateRouting(
                simulationData,
                [expression, higherPriority],
                categories,
                areas,
                questions
            )

            const selected = getSelectedRoutingExpression(results)

            expect(selected?.expression.id).toBe(2)
            expect(selected?.order).toBe(1)
        })

        it("returns null when no expressions match", () => {
            const results = simulateRouting(
                { ...simulationData, category: "afvalbak" },
                [expression],
                categories,
                areas,
                questions
            )

            expect(getSelectedRoutingExpression(results)).toBeNull()
        })
    })
})
