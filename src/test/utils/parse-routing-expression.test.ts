import { describe, expect, it } from "vitest"
import { parseRoutingExpression } from "@/utils/parse-routing-expression"
import { mapRoutingQueryToCode } from "@/mappers/query-to-expression"
import {categories} from "@/test/fixtures/parse-routing-expression.ts";

/* Verify that parsing and serializing preserve expression behavior */
function roundTrip(code: string) {
    const parsed = parseRoutingExpression(code, categories)
    const reconstructed = mapRoutingQueryToCode(parsed, { categories })

    return { parsed, reconstructed }
}

describe("parseRoutingExpression", () => {
    describe("Basic conditions", () => {
        it("parses a single category", () => {
            const result = parseRoutingExpression(
                'sub == "Bank"',
                categories
            )

            expect(result).toMatchObject({
                combinator: "and",
                rules: [{
                    field: "category",
                    value: {
                        categories: [{
                            category: "1",
                            question: "",
                            answer: "",
                        }],
                    },
                }],
            })
        })

        it("parses a single area", () => {
            const result = parseRoutingExpression(
                'location in areas."district"."WK01"',
                categories
            )

            expect(result.rules[0]).toMatchObject({
                field: "area",
                value: ["WK01"],
            })
        })

        it("parses a category with an additional question", () => {
            const result = parseRoutingExpression(
                '(sub == "Bank" and Testvraag == "1")',
                categories
            )

            expect(result.rules[0]).toMatchObject({
                field: "category",
                value: {
                    categories: [{
                        category: "1",
                        question: "Testvraag",
                        answer: "1",
                    }],
                },
            })
        })
    })

    describe("Multiple conditions", () => {
        it("merges OR categories into one multiselect rule", () => {
            const result = parseRoutingExpression(
                '(sub == "Bank" or sub == "Boom" or sub == "Afval")',
                categories
            )

            expect(result.rules).toHaveLength(1)
            expect(result.rules[0]).toMatchObject({
                field: "category",
                value: {
                    categories: [
                        { category: "1" },
                        { category: "2" },
                        { category: "3" },
                    ],
                },
            })
        })

        it("merges OR areas into one multiselect rule", () => {
            const result = parseRoutingExpression(
                '(location in areas."district"."WK01" or location in areas."district"."WK02")',
                categories
            )

            expect(result.rules[0]).toMatchObject({
                field: "area",
                value: ["WK01", "WK02"],
            })
        })

        it("keeps AND categories as separate rules", () => {
            const result = parseRoutingExpression(
                '(sub == "Bank" and sub == "Boom")',
                categories
            )

            expect(result.combinator).toBe("and")
            expect(result.rules).toHaveLength(2)
        })

        it("keeps mixed OR conditions as a group", () => {
            const result = parseRoutingExpression(
                '(sub == "Bank" or location in areas."district"."WK01")',
                categories
            )

            expect(result.combinator).toBe("or")
            expect(result.rules).toHaveLength(2)
        })
    })

    describe("Nested conditions", () => {
        it("preserves mixed AND/OR nesting", () => {
            const code =
                '((sub == "Bank" or sub == "Boom") and location in areas."district"."WK01")'

            const { parsed, reconstructed } = roundTrip(code)

            expect(parsed.combinator).toBe("and")
            expect(parsed.rules).toHaveLength(2)
            expect(reconstructed).toContain('sub == "Bank"')
            expect(reconstructed).toContain('sub == "Boom"')
            expect(reconstructed).toContain('"WK01"')
        })

        it("preserves deeply nested expressions", () => {
            const code = [
                "(",
                '  (sub == "Bank" or sub == "Boom")',
                "  and",
                "  (",
                '    location in areas."district"."WK01"',
                "    or",
                "    (",
                '      sub == "Afval"',
                "      and",
                '      (sub == "Fiets" or sub == "Straatverlichting")',
                "    )",
                "  )",
                ")",
            ].join(" ")

            const { parsed, reconstructed } = roundTrip(code)

            expect(parsed.combinator).toBe("and")
            expect(parsed.rules).toHaveLength(2)

            // The reconstructed expression must be parseable again
            expect(() =>
                parseRoutingExpression(reconstructed, categories)
            ).not.toThrow()
        })

        it("preserves questions within nested groups", () => {
            const code =
                '((sub == "Bank" and Testvraag == "1") or (sub == "Boom" and AndereVraag == "2"))'

            const result = parseRoutingExpression(code, categories)

            // Both category/question combinations become one multiselect
            expect(result.rules[0]).toMatchObject({
                field: "category",
                value: {
                    categories: [
                        {
                            category: "1",
                            question: "Testvraag",
                            answer: "1",
                        },
                        {
                            category: "2",
                            question: "AndereVraag",
                            answer: "2",
                        },
                    ],
                },
            })
        })
    })

    describe("Syntax validation", () => {
        it("rejects an empty expression", () => {
            expect(() =>
                parseRoutingExpression("", categories)
            ).toThrow()
        })

        it("rejects unbalanced parentheses", () => {
            expect(() =>
                parseRoutingExpression(
                    '(sub == "Bank" and sub == "Boom"',
                    categories
                )
            ).toThrow()
        })

        it("rejects an unknown category", () => {
            expect(() =>
                parseRoutingExpression(
                    'sub == "Onbekend"',
                    categories
                )
            ).toThrow("Unknown category")
        })

        it("rejects a question without a category", () => {
            expect(() =>
                parseRoutingExpression(
                    'Testvraag == "1"',
                    categories
                )
            ).toThrow("Question without category")
        })

        it("rejects unsupported syntax", () => {
            expect(() =>
                parseRoutingExpression(
                    'sub != "Bank"',
                    categories
                )
            ).toThrow()
        })

        it("rejects trailing invalid syntax", () => {
            expect(() =>
                parseRoutingExpression(
                    'sub == "Bank" invalid',
                    categories
                )
            ).toThrow()
        })
    })
})
