import type { Expression } from "@/types/domain/routing"
import type { Category } from "@/types/domain/reference-data"
import type { RoutingSimulationData } from "@/types/routing-simulations"

export const categoriesFixture = [
    {
        id: 1,
        slug: "bank",
        name: "Bank",
    },
] as Category[]

export const simulationFixture: RoutingSimulationData = {
    category: "bank",
    area: "WK199101",
    question: "",
    answer: "",
}

/* Create an expression with overridable properties */
export function createExpression(overrides: Partial<Expression> = {},): Expression {
    return {
        id: crypto.randomUUID(),
        name: "Test routering",
        code: '(sub == "Bank" and location in areas."district"."WK199101")',
        type: "routing",
        isActive: true,
        routing: {
            department: {
                id: 1,
                code: "BEHEER",
                name: "Beheer",
                isIntern: true,
            },
            order: 10,
        },
        ...overrides,
    }
}
