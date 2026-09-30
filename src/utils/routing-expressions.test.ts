import { describe, expect, it } from "vitest"
import {getRoutingExpressionAreas, getRoutingExpressionQuestionsAnswers} from "./routing-expressions"
import {
    areaExpressionsFixture, areaRoutingExpressionFixture,
    expressionsFixture,
    questionsFixture,
    routingExpressionFixture,
} from "@/test/fixtures/routing-expressions"

{/* Tests for extracting question and answer conditions from Routing Expressions */}
describe("getRoutingExpressionQuestionsAnswers", () => {
    it("returns the readable answer for a question condition", () => {
        const routingExpression = {
            ...routingExpressionFixture,
            _expression: "SingleQuestion",
        }

        const result = getRoutingExpressionQuestionsAnswers(
            routingExpression,
            expressionsFixture,
            questionsFixture
        )

        expect(result).toEqual([
            "Textielcontainer_type_melding = De textielcontainer is beschadigd",
        ])
    })

    it("groups multiple answers for the same question", () => {
        const routingExpression = {
            ...routingExpressionFixture,
            _expression: "MultipleAnswers",
        }

        const result = getRoutingExpressionQuestionsAnswers(
            routingExpression,
            expressionsFixture,
            questionsFixture
        )

        expect(result).toEqual([
            "Textielcontainer_type_melding = De textielcontainer is beschadigd, Anders",
        ])
    })

    it("ignores comparisons that do not belong to a question", () => {
        const routingExpression = {
            ...routingExpressionFixture,
            _expression: "CategoryOnly",
        }

        const result = getRoutingExpressionQuestionsAnswers(
            routingExpression,
            expressionsFixture,
            questionsFixture
        )

        expect(result).toEqual([])
    })

    it("recognizes Onderwerp as a question", () => {
        const routingExpression = {
            ...routingExpressionFixture,
            _expression: "SubjectQuestion",
        }

        const result = getRoutingExpressionQuestionsAnswers(
            routingExpression,
            expressionsFixture,
            questionsFixture
        )

        expect(result).toEqual([
            "Onderwerp = De textielcontainer is beschadigd",
        ])
    })
})

{/* Tests for extracting area information from Routing Expressions */}
describe("getRoutingExpressionAreas", () => {
    it("extracts an area type and code", () => {
        const result = getRoutingExpressionAreas(
            areaRoutingExpressionFixture,
            areaExpressionsFixture
        )

        expect(result).toEqual([
            {
                type: "district",
                code: "WK199101",
            },
        ])
    })

    it("supports area types other than district", () => {
        const routingExpression = {
            ...areaRoutingExpressionFixture,
            _expression: "DifferentAreaType",
        }

        const result = getRoutingExpressionAreas(
            routingExpression,
            areaExpressionsFixture
        )

        expect(result).toEqual([
            {
                type: "neighbourhood",
                code: "BU19910101",
            },
        ])
    })

    it("returns an empty array when no area is used", () => {
        const routingExpression = {
            ...areaRoutingExpressionFixture,
            _expression: "CategoryOnly",
        }

        const result = getRoutingExpressionAreas(
            routingExpression,
            areaExpressionsFixture
        )

        expect(result).toEqual([])
    })
})