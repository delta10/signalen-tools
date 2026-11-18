import type { Expression } from "@/types/domain/routing"

const STORAGE_KEY = "routing-expressions"

export const expressionRepository = {
    getAll(): Expression[] {
        const stored = localStorage.getItem(STORAGE_KEY)

        return stored ? JSON.parse(stored) : []
    },

    saveAll(expressions: Expression[]): void {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(expressions)
        )
    },

    add(expression: Expression): void {
        const expressions = this.getAll()

        this.saveAll([...expressions, expression])
    },

    getById(id: Expression["id"]): Expression | undefined {
        return this.getAll().find(
            (expression) => expression.id === id
        )
    },

    update(expression: Expression): void {
        const expressions = this.getAll()

        const exists = expressions.some(
            (existing) => existing.id === expression.id
        )

        if (!exists) {
            throw new Error(
                `Expression met ID ${expression.id} niet gevonden`
            )
        }

        this.saveAll(
            expressions.map((existing) =>
                existing.id === expression.id
                    ? expression
                    : existing
            )
        )
    },

    remove(id: Expression["id"]): void {
        const expressions = this.getAll()

        this.saveAll(
            expressions.filter((expression) => expression.id !== id)
        )
    }
}
