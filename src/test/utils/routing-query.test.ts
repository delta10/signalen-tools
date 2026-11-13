import { describe, expect, it } from "vitest"
import { validateRoutingQuery } from "@/utils/validate-routing-query"
import {categoryRuleFixture, areaRuleFixture, referenceDataFixture, createQuery,} from "@/test/fixtures/routing-query"

describe("validateRoutingQuery", () => {
    describe("group validation", () => {
        it("returns an error when the root group is empty", () => {
            const query = createQuery([])

            const result = validateRoutingQuery(query, referenceDataFixture)

            expect(result).toEqual([
                {
                    path: [],
                    message: "Voeg minimaal één voorwaarde toe.",
                },
            ])
        })

        it("returns an error for an empty nested group", () => {
            const query = createQuery([
                categoryRuleFixture,
                createQuery([], "or"),
            ])

            const result = validateRoutingQuery(query, referenceDataFixture)

            expect(result).toEqual([
                {
                    path: [1],
                    message: "Voeg minimaal één voorwaarde toe.",
                },
            ])
        })

        it("accepts a valid nested AND/OR structure", () => {
            const query = createQuery([
                createQuery([categoryRuleFixture, areaRuleFixture], "and"),
                createQuery([categoryRuleFixture], "or"),
            ], "or")

            const result = validateRoutingQuery(query, referenceDataFixture)

            expect(result).toEqual([])
        })
    })

    describe("category validation", () => {
        it("returns an error when no categories are selected", () => {
            const query = createQuery([
                {
                    ...categoryRuleFixture,
                    value: { categories: [] },
                },
            ])

            const result = validateRoutingQuery(query, referenceDataFixture)

            expect(result).toEqual([
                {
                    path: [0],
                    message: "Selecteer minimaal één categorie.",
                },
            ])
        })

        it("accepts a category without an additional question", () => {
            const query = createQuery([categoryRuleFixture])

            expect(validateRoutingQuery(query, referenceDataFixture)).toEqual([])
        })

        it("accepts multiple selected categories", () => {
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

            expect(validateRoutingQuery(query, referenceDataFixture)).toEqual([])
        })

        it("requires an answer when an additional question is selected", () => {
            const query = createQuery([
                {
                    ...categoryRuleFixture,
                    value: {
                        categories: [
                            {
                                category: "1",
                                question: "Afvalbak_type_melding",
                                answer: "",
                            },
                        ],
                    },
                },
            ])

            const result = validateRoutingQuery(query, referenceDataFixture)

            expect(result).toEqual([
                {
                    path: [0],
                    message: "Selecteer een antwoord bij Afvalbak.",
                },
            ])
        })

        it("accepts an additional question with an answer", () => {
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

            expect(validateRoutingQuery(query, referenceDataFixture)).toEqual([])
        })

        it("reports errors for multiple unanswered questions", () => {
            const query = createQuery([
                {
                    ...categoryRuleFixture,
                    value: {
                        categories: [
                            { category: "1", question: "Vraag_A", answer: "" },
                            { category: "2", question: "Vraag_B", answer: "" },
                        ],
                    },
                },
            ])

            const result = validateRoutingQuery(query, referenceDataFixture)

            expect(result).toEqual([
                {
                    path: [0],
                    message: "Selecteer een antwoord bij Afvalbak.",
                },
                {
                    path: [0],
                    message: "Selecteer een antwoord bij Bank.",
                },
            ])
        })
    })

    describe("area validation", () => {
        it("returns an error when no areas are selected", () => {
            const query = createQuery([
                { ...areaRuleFixture, value: [] },
            ])

            const result = validateRoutingQuery(query, referenceDataFixture)

            expect(result).toEqual([
                {
                    path: [0],
                    message: "Selecteer minimaal één gebied.",
                },
            ])
        })

        it("accepts multiple selected areas", () => {
            const query = createQuery([
                { ...areaRuleFixture, value: ["WK199101", "WK199102"] },
            ])

            expect(validateRoutingQuery(query, referenceDataFixture)).toEqual([])
        })
    })

    describe("validation paths", () => {
        it("returns the correct path for a rule in a nested group", () => {
            const query = createQuery([
                categoryRuleFixture,
                createQuery([
                    areaRuleFixture,
                    { ...categoryRuleFixture, value: { categories: [] } },
                ]),
            ])

            const result = validateRoutingQuery(query, referenceDataFixture)

            expect(result).toEqual([
                {
                    path: [1, 1],
                    message: "Selecteer minimaal één categorie.",
                },
            ])
        })
    })
})