
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getQuestions } from "@/services/questions-answers"

export const questionsQueryKey = ["questions"]

export function useQuestions() {
    return useQuery({
        queryKey: questionsQueryKey,
        queryFn: getQuestions,
        staleTime: Infinity,
        retry: false,
    })
}

export function useInvalidateQuestions() {
    const queryClient = useQueryClient()

    return () =>
        queryClient.invalidateQueries({
            queryKey: questionsQueryKey,
        })
}
