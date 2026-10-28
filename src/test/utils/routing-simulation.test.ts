import { describe, expect, it } from "vitest"
import {simulateRouting, getSelectedRoutingExpression,} from "@/utils/routing-simulations"
import {categoriesFixture, simulationFixture, createExpression,} from "@/test/fixtures/routing-simulation"

describe("routing simulations", () => {
    it("excludes inactive routing expressions", () => {
        const active = createExpression({ name: "Actief" })
        const inactive = createExpression({
            name: "Inactief",
            isActive: false,
        })

        const results = simulateRouting(
            simulationFixture,
            [active, inactive],
            categoriesFixture,
        )

        expect(results).toHaveLength(1)
        expect(results[0].expression.name).toBe("Actief")
        expect(results[0].matches).toBe(true)
    })

    it("excludes expressions without routing", () => {
        const expression = createExpression({ routing: null })

        const results = simulateRouting(
            simulationFixture,
            [expression],
            categoriesFixture,
        )

        expect(results).toEqual([])
    })

    it("selects the matching expression with the lowest order", () => {
        const lowPriority = createExpression({
            name: "Lage prioriteit",
            routing: {
                ...createExpression().routing!,
                order: 20,
            },
        })

        const highPriority = createExpression({
            name: "Hoge prioriteit",
            routing: {
                ...createExpression().routing!,
                order: 5,
            },
        })

        const results = simulateRouting(
            simulationFixture,
            [lowPriority, highPriority],
            categoriesFixture,
        )

        const selected = getSelectedRoutingExpression(results)

        expect(selected?.expression.name).toBe("Hoge prioriteit")
        expect(selected?.order).toBe(5)
    })
})
