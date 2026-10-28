import { describe, expect, it } from "vitest"
import { evaluateRoutingExpression } from "@/utils/evaluate-routing-expression"
import type { RoutingSimulationData } from "@/types/routing-simulations"
import {expressionCodeFixture} from "@/test/fixtures/evaluate-expression.ts";
import {categoriesFixture} from "@/test/fixtures/evaluate-expression";

function createSimulation(overrides: Partial<RoutingSimulationData> = {},): RoutingSimulationData {
    return {
        category: "bank",
        area: "WK199101",
        question: "",
        answer: "",
        ...overrides,
    }
}

describe("evaluateRoutingExpression", () => {
    it("matches a category without requiring another category's additional question", () => {
        const simulation = createSimulation()

        const result = evaluateRoutingExpression(expressionCodeFixture, {
            simulation,
            categories: categoriesFixture,
        })

        expect(result).toBe(true)
    })

    it("matches a category with the correct additional question and answer", () => {
        const simulation = createSimulation({
            category: "straatverlichting",
            area: "WK194804",
            question: "Testvragen_checkbox_2",
            answer: "1",
        })

        const result = evaluateRoutingExpression(expressionCodeFixture, {
            simulation,
            categories: categoriesFixture,
        })

        expect(result).toBe(true)
    })

    it("does not match when the additional question has an incorrect answer", () => {
        const simulation = createSimulation({
            category: "straatverlichting",
            question: "Testvragen_checkbox_2",
            answer: "2",
        })

        const result = evaluateRoutingExpression(expressionCodeFixture, {
            simulation,
            categories: categoriesFixture,
        })

        expect(result).toBe(false)
    })

    it("does not match when the area is outside the selected areas", () => {
        const simulation = createSimulation({
            area: "WK999999",
        })

        const result = evaluateRoutingExpression(expressionCodeFixture, {
            simulation,
            categories: categoriesFixture,
        })

        expect(result).toBe(false)
    })
})
