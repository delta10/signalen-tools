import type { Expression } from "@/types/domain/routing"

const STORAGE_KEY = "routing-expressions"

export const expressionRepository = {
    getAll(): Expression[] {
        const stored = localStorage.getItem(STORAGE_KEY)

        return stored ? JSON.parse(stored) : []
    },

    existsByName(name: string, excludeId?: string): boolean {
        return this.getAll().some(
            (expression) =>
                expression.id !== excludeId &&
                expression.name.trim().toLowerCase() ===
                name.trim().toLowerCase()
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