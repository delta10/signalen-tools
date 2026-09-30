import { describe, expect, it } from "vitest"
import {doesAreaMatch, doesCategoryMatch, doesQuestionAnswerMatch, simulateRouting} from "@/utils/routing-simulations.ts";
import {areaExpressionsFixture, areaRoutingExpressionFixture, expressionsFixture, questionsFixture, routingExpressionFixture} from "@/test/fixtures/routing-expressions.ts";
import {areasFixture, categoriesFixture, simulationDataFixture} from "@/test/fixtures/routing-simulation.ts";

/* Tests for matching category conditions during routing simulation */
describe("doesCategoryMatch", () => {
    it("returns true when the selected category matches the expression", () => {
        const result = doesCategoryMatch(
            simulationDataFixture,
            {
                ...routingExpressionFixture,
                _expression: "CategoryOnly",
            },
            expressionsFixture,
            categoriesFixture
        )

        expect(result).toBe(true)
    })

    it("returns false when the selected category does not match the expression", () => {
        const result = doesCategoryMatch(
            {
                ...simulationDataFixture,
                category: "textielcontainer",
            },
            {
                ...routingExpressionFixture,
                _expression: "CategoryOnly",
            },
            expressionsFixture,
            categoriesFixture
        )

        expect(result).toBe(false)
    })

    it("returns true when the expression has no category condition", () => {
        const result = doesCategoryMatch(
            simulationDataFixture,
            {
                ...areaRoutingExpressionFixture,
                _expression: "DifferentAreaType",
            },
            areaExpressionsFixture,
            categoriesFixture
        )

        expect(result).toBe(true)
    })
})


/* Tests for matching area conditions during routing simulation */
describe("doesAreaMatch", () => {
    it("returns true when the selected area matches the expression", () => {
        const result = doesAreaMatch(
            simulationDataFixture,
            areaRoutingExpressionFixture,
            areaExpressionsFixture,
            areasFixture
        )

        expect(result).toBe(true)
    })

    it("returns false when the selected area does not match the expression", () => {
        const result = doesAreaMatch(
            {
                ...simulationDataFixture,
                area: "Veghel",
            },
            areaRoutingExpressionFixture,
            areaExpressionsFixture,
            areasFixture
        )

        expect(result).toBe(false)
    })

    it("returns true when the expression has no area condition", () => {
        const result = doesAreaMatch(
            simulationDataFixture,
            {
                ...routingExpressionFixture,
                _expression: "CategoryOnly",
            },
            expressionsFixture,
            areasFixture
        )

        expect(result).toBe(true)
    })
})


/* Tests for matching question and answer conditions during routing simulation */
describe("doesQuestionAnswerMatch", () => {
    it("returns true when the selected question and answer match the expression", () => {
        const result = doesQuestionAnswerMatch(
            {
                ...simulationDataFixture,
                question: "Textielcontainer_type_melding",
                answer: "De textielcontainer is beschadigd",
            },
            {
                ...routingExpressionFixture,
                _expression: "SingleQuestion",
            },
            expressionsFixture,
            questionsFixture
        )

        expect(result).toBe(true)
    })

    it("returns false when the selected answer does not match the expression", () => {
        const result = doesQuestionAnswerMatch(
            {
                ...simulationDataFixture,
                question: "Textielcontainer_type_melding",
                answer: "Anders",
            },
            {
                ...routingExpressionFixture,
                _expression: "SingleQuestion",
            },
            expressionsFixture,
            questionsFixture
        )

        expect(result).toBe(false)
    })

    it("returns true when the expression has no question condition", () => {
        const result = doesQuestionAnswerMatch(
            simulationDataFixture,
            {
                ...routingExpressionFixture,
                _expression: "CategoryOnly",
            },
            expressionsFixture,
            questionsFixture
        )

        expect(result).toBe(true)
    })
})


/* Tests for combining all routing checks into a simulation result */
describe("simulateRouting", () => {
    it("marks an expression as matching when all checks succeed", () => {
        const routingExpressions = [
            {
                ...routingExpressionFixture,
                _expression: "CategoryOnly",
            },
        ]

        const result = simulateRouting(
            simulationDataFixture,
            routingExpressions,
            expressionsFixture,
            categoriesFixture,
            areasFixture,
            questionsFixture,
            [],
            []
        )

        expect(result).toHaveLength(1)

        expect(result[0]).toMatchObject({
            matches: true,
            checks: {
                category: true,
                area: true,
                questionAnswer: true,
            },
        })
    })

    it("marks an expression as not matching when one check fails", () => {
        const routingExpressions = [
            {
                ...routingExpressionFixture,
                _expression: "CategoryOnly",
            },
        ]

        const result = simulateRouting(
            {
                ...simulationDataFixture,
                category: "textielcontainer",
            },
            routingExpressions,
            expressionsFixture,
            categoriesFixture,
            areasFixture,
            questionsFixture,
            [],
            []
        )

        expect(result).toHaveLength(1)

        expect(result[0]).toMatchObject({
            matches: false,
            checks: {
                category: false,
                area: true,
                questionAnswer: true,
            },
        })
    })
})