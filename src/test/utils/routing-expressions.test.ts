import { describe, expect, it } from "vitest"
import {getExpressionAreas, getExpressionQuestionsAnswers,} from "@/utils/routing-expressions.ts"
import {expressionsFixture, questionsFixture} from "@/test/fixtures/routing-expressions.ts";

/* Tests for extracting question and answer conditions from Expressions */
describe("getExpressionQuestionsAnswers", () => {
    it("returns the readable answer for a question condition", () => {
        const expression = expressionsFixture.find(
            (expression) => expression.name === "SingleQuestion"
        )!

        const result = getExpressionQuestionsAnswers(
            expression,
            questionsFixture
        )

        expect(result).toEqual([
            "Textielcontainer_type_melding = De textielcontainer is beschadigd",
        ])
    })

    it("groups multiple answers for the same question", () => {
        const expression = expressionsFixture.find(
            (expression) => expression.name === "MultipleAnswers"
        )!

        const result = getExpressionQuestionsAnswers(
            expression,
            questionsFixture
        )

        expect(result).toEqual([
            "Textielcontainer_type_melding = De textielcontainer is beschadigd, Anders",
        ])
    })

    it("ignores comparisons that do not belong to a question", () => {
        const expression = expressionsFixture.find(
            (expression) => expression.name === "CategoryOnly"
        )!

        const result = getExpressionQuestionsAnswers(
            expression,
            questionsFixture
        )

        expect(result).toEqual([])
    })

    it("recognizes Onderwerp as a question", () => {
        const expression = expressionsFixture.find(
            (expression) => expression.name === "SubjectQuestion"
        )!

        const result = getExpressionQuestionsAnswers(
            expression,
            questionsFixture
        )

        expect(result).toEqual([
            "Onderwerp = De textielcontainer is beschadigd",
        ])
    })
})

/* Tests for extracting area information from Expressions */
describe("getExpressionAreas", () => {
    it("extracts an area type and code", () => {
        const expression = expressionsFixture.find(
            (expression) => expression.name === "DistrictArea"
        )!

        const result = getExpressionAreas(expression)

        expect(result).toEqual([
            {
                type: "district",
                code: "WK199101",
            },
        ])
    })

    it("supports area types other than district", () => {
        const expression = expressionsFixture.find(
            (expression) => expression.name === "DifferentAreaType"
        )!

        const result = getExpressionAreas(expression)

        expect(result).toEqual([
            {
                type: "neighbourhood",
                code: "BU19910101",
            },
        ])
    })

    it("returns an empty array when no area is used", () => {
        const expression = expressionsFixture.find(
            (expression) => expression.name === "CategoryOnly"
        )!

        const result = getExpressionAreas(expression)

        expect(result).toEqual([])
    })
})