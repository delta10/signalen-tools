import { useQuery, useQueryClient } from "@tanstack/react-query"
import { expressionRepository } from "@/repositories/expression-repository"
import type { Expression } from "@/types/domain/routing"

export const expressionsQueryKey = ["stored-expressions"] as const

export function useExpressions() {
    return useQuery({
        queryKey: expressionsQueryKey,
        queryFn: () => expressionRepository.getAll(),
        staleTime: Infinity,
    })
}

export function useExpressionActions() {
    const queryClient = useQueryClient()

    function saveAll(expressions: Expression[]) {
        expressionRepository.saveAll(expressions)

        queryClient.setQueryData(
            expressionsQueryKey,
            expressions
        )
    }

    function add(expression: Expression) {
        const expressions = expressionRepository.getAll()

        saveAll([...expressions, expression])
    }

    function update(expression: Expression) {
        const expressions = expressionRepository.getAll()

        if (!expressions.some((item) => item.id === expression.id)) {
            throw new Error("Routing expression niet gevonden")
        }

        saveAll(
            expressions.map((item) =>
                item.id === expression.id ? expression : item
            )
        )
    }

    function remove(id: Expression["id"]) {
        const expressions = expressionRepository.getAll()

        saveAll(
            expressions.filter((expression) => expression.id !== id)
        )
    }

    return { saveAll, add, update, remove }
}