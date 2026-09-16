import { describe, expect, it } from "vitest"
import { getRoutingExpressionQuestionsAnswers } from "./routing-expressions"
import {expressionsFixture, questionsFixture, routingExpressionFixture,} from "@/test/fixtures/routing-expressions"

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