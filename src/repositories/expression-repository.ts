import type { Expression } from "@/types/domain/routing"

const STORAGE_KEY = "routing-expressions"
const IMPORTED_AT_KEY = "routing-expressions-imported-at"

export const expressionRepository = {
    getAll(): Expression[] {
        const stored = localStorage.getItem(STORAGE_KEY)

        return stored ? JSON.parse(stored) : []
    },

    getImportedAt(): string | null {
        return localStorage.getItem(IMPORTED_AT_KEY)
    },

    setImportedAt(): void {
        localStorage.setItem(
            IMPORTED_AT_KEY,
            new Date().toISOString()
        )
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