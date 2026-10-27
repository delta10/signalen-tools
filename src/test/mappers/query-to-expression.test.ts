import { describe, expect, it } from "vitest"
import { mapRoutingQueryToCode } from "@/mappers/query-to-expression"
import {categoryRuleFixture, areaRuleFixture, referenceDataFixture, createQuery,} from "@/test/fixtures/routing-query"

describe("mapRoutingQueryToCode", () => {
    it("maps multiple categories using OR", () => {
        const query = createQuery([
            {
                ...categoryRuleFixture,
                value: {
                    categories: [
                        { category: "1", question: "", answer: "" },
                        { category: "2", question: "", answer: "" },
                    ],
                },
            },
        ])

        expect(mapRoutingQueryToCode(query, referenceDataFixture))
            .toBe('((sub == "Afvalbak" or sub == "Bank"))')
    })

    it("combines an additional question with its category using AND", () => {
        const query = createQuery([
            {
                ...categoryRuleFixture,
                value: {
                    categories: [
                        {
                            category: "1",
                            question: "Afvalbak_type_melding",
                            answer: "1",
                        },
                    ],
                },
            },
        ])

        expect(mapRoutingQueryToCode(query, referenceDataFixture))
            .toBe(
                '(((sub == "Afvalbak" and Afvalbak_type_melding == "1")))'
            )
    })

    it("maps multiple areas using OR", () => {
        const query = createQuery([
            {
                ...areaRuleFixture,
                value: ["WK199101", "WK199102"],
            },
        ])

        expect(mapRoutingQueryToCode(query, referenceDataFixture))
            .toBe(
                '((location in areas."district"."WK199101" or location in areas."district"."WK199102"))'
            )
    })

    it("preserves nested AND/OR group logic", () => {
        const query = createQuery([
            createQuery([
                categoryRuleFixture,
                areaRuleFixture,
            ], "and"),
            createQuery([
                categoryRuleFixture,
                areaRuleFixture,
            ], "or"),
        ], "or")

        const result = mapRoutingQueryToCode(query, referenceDataFixture)

        expect(result).toBe(
            '(((sub == "Afvalbak") and (location in areas."district"."WK199101")) or ((sub == "Afvalbak") or (location in areas."district"."WK199101")))'
        )
    })

    it("rejects an unknown category instead of generating invalid code", () => {
        const query = createQuery([
            {
                ...categoryRuleFixture,
                value: {
                    categories: [
                        { category: "999", question: "", answer: "" },
                    ],
                },
            },
        ])

        expect(() =>
            mapRoutingQueryToCode(query, referenceDataFixture)
        ).toThrow("Unknown category: 999")
    })
})
