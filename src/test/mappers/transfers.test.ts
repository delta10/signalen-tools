import { describe, expect, it } from "vitest"
import {
    mapTransfersToDomain,
    mapDepartmentTransfersToDomain,
    mapAreaTransfersToDomain,
    mapQuestionTransfersToDomain,
    mapCategoryTransfersToDomain,
} from "@/mappers/import-export.ts"

import type {
    RoutingExpressionTransfer,
    ExpressionTransfer,
    DepartmentTransfer,
    AreaTransfer,
    QuestionsTransfer,
    CategoryTransfer,
} from "@/types/import-export/expressions"

import type { Department } from "@/types/domain/reference-data"

// Tests for converting routing expressions into domain expressions
describe("mapTransfersToDomain", () => {
    const routingExpressions = [
        {
            _expression: "Straatverlichting",
            _department: "VER",
            _user: "",
            order: "10",
            is_active: "1",
        },
    ] as RoutingExpressionTransfer[]

    const expressions = [
        {
            name: "Straatverlichting",
            code: 'sub == "Straatverlichting"',
            _type: "routing",
        },
    ] as ExpressionTransfer[]

    const departments: Department[] = [
        {
            id: 1,
            code: "VER",
            name: "Verlichting",
            isIntern: true,
        },
    ]

    it("maps a routing expression to a domain expression", () => {
        const result = mapTransfersToDomain(
            routingExpressions,
            expressions,
            departments
        )

        expect(result).toEqual([
            {
                id: 1,
                name: "Straatverlichting",
                code: 'sub == "Straatverlichting"',
                type: "routing",
                isActive: true,
                routing: {
                    department: departments[0],
                    order: 10,
                },
            },
        ])
    })

    it("converts inactive expressions to isActive false", () => {
        const result = mapTransfersToDomain(
            [{ ...routingExpressions[0], is_active: "0" }],
            expressions,
            departments
        )

        expect(result[0].isActive).toBe(false)
    })

    it("skips routing expressions without a matching expression", () => {
        const result = mapTransfersToDomain(
            [{ ...routingExpressions[0], _expression: "Unknown" }],
            expressions,
            departments
        )

        expect(result).toEqual([])
    })

    it("creates a fallback department when no matching department exists", () => {
        const result = mapTransfersToDomain(
            routingExpressions,
            expressions,
            []
        )

        expect(result[0].routing?.department).toEqual({
            id: 0,
            code: "VER",
            name: "VER",
            isIntern: false,
        })
    })

    it("converts the routing order from string to number", () => {
        const result = mapTransfersToDomain(
            routingExpressions,
            expressions,
            departments
        )

        expect(result[0].routing?.order).toBe(10)
    })

    it("returns an empty array when no routing expressions exist", () => {
        expect(
            mapTransfersToDomain([], expressions, departments)
        ).toEqual([])
    })
})

// Tests for converting department transfers
describe("mapDepartmentTransfersToDomain", () => {
    it("maps department properties and converts is_intern", () => {
        const departments = [
            {
                code: "AFV",
                name: "Afval",
                is_intern: "1",
            },
            {
                code: "VER",
                name: "Verlichting",
                is_intern: "0",
            },
        ] as DepartmentTransfer[]

        const result = mapDepartmentTransfersToDomain(departments)

        expect(result).toEqual([
            {
                id: 0,
                code: "AFV",
                name: "Afval",
                isIntern: true,
            },
            {
                id: 1,
                code: "VER",
                name: "Verlichting",
                isIntern: false,
            },
        ])
    })

    it("returns an empty array for empty input", () => {
        expect(mapDepartmentTransfersToDomain([])).toEqual([])
    })
})

// Tests for converting area transfers
describe("mapAreaTransfersToDomain", () => {
    it("maps areas and creates a nested area type", () => {
        const areas = [
            {
                code: "WK199101",
                name: "Uden",
                _type: "district",
            },
        ] as AreaTransfer[]

        const result = mapAreaTransfersToDomain(areas)

        expect(result).toEqual([
            {
                id: 0,
                code: "WK199101",
                name: "Uden",
                type: {
                    id: 0,
                    code: "district",
                    name: "district",
                },
            },
        ])
    })

    it("assigns sequential IDs to multiple areas", () => {
        const areas = [
            { code: "A", name: "Area A", _type: "district" },
            { code: "B", name: "Area B", _type: "district" },
        ] as AreaTransfer[]

        const result = mapAreaTransfersToDomain(areas)

        expect(result.map((area) => area.id)).toEqual([0, 1])
    })
})

// Tests for converting question transfers
describe("mapQuestionTransfersToDomain", () => {
    const questions = [
        {
            key: "Textielcontainer_type_melding",
            field_type: "radio_input",
            required: "1",
            meta: JSON.stringify({
                label: "Wat is er aan de hand?",
                values: {
                    "1": "De container is beschadigd",
                    "2": "De container is vol",
                },
            }),
            categories: "textielcontainer|True|True, afvalbak|True|True",
        },
    ] as QuestionsTransfer[]

    it("maps question properties and extracts metadata", () => {
        const result = mapQuestionTransfersToDomain(questions)

        expect(result).toEqual([
            {
                id: 0,
                key: "Textielcontainer_type_melding",
                label: "Wat is er aan de hand?",
                fieldType: "radio_input",
                required: true,
                answers: [
                    { value: "1", label: "De container is beschadigd" },
                    { value: "2", label: "De container is vol" },
                ],
                categorySlugs: ["textielcontainer", "afvalbak"],
            },
        ])
    })

    it("uses the question key when metadata has no label", () => {
        const result = mapQuestionTransfersToDomain([
            {
                ...questions[0],
                meta: JSON.stringify({ values: {} }),
            },
        ])

        expect(result[0].label).toBe("Textielcontainer_type_melding")
    })

    it("returns an empty answers array when metadata has no values", () => {
        const result = mapQuestionTransfersToDomain([
            {
                ...questions[0],
                meta: JSON.stringify({ label: "Testvraag" }),
            },
        ])

        expect(result[0].answers).toEqual([])
    })

    it("converts optional questions to required false", () => {
        const result = mapQuestionTransfersToDomain([
            { ...questions[0], required: "0" },
        ])

        expect(result[0].required).toBe(false)
    })

    it("removes empty category slugs", () => {
        const result = mapQuestionTransfersToDomain([
            {
                ...questions[0],
                categories: "afvalbak|True|True, , textielcontainer|True|True",
            },
        ])

        expect(result[0].categorySlugs).toEqual([
            "afvalbak",
            "textielcontainer",
        ])
    })

    it("returns an empty array for empty input", () => {
        expect(mapQuestionTransfersToDomain([])).toEqual([])
    })
})

// Tests for converting category transfers
describe("mapCategoryTransfersToDomain", () => {
    it("maps categories to simplified domain categories", () => {
        const categories = [
            {
                slug: "afvalbak",
                name: "Afvalbak",
            },
            {
                slug: "straatverlichting",
                name: "Straatverlichting",
            },
        ] as CategoryTransfer[]

        const result = mapCategoryTransfersToDomain(categories)

        expect(result).toEqual([
            {
                id: 0,
                slug: "afvalbak",
                name: "Afvalbak",
            },
            {
                id: 1,
                slug: "straatverlichting",
                name: "Straatverlichting",
            },
        ])
    })

    it("returns an empty array for empty input", () => {
        expect(mapCategoryTransfersToDomain([])).toEqual([])
    })
})
