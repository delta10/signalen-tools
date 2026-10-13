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

    remove(id: string): void {
        const expressions = this.getAll()

        this.saveAll(
            expressions.filter((expression) => expression.id !== id)
        )
    }
}