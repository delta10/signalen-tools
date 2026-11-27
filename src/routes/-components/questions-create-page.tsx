import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { QuestionForm } from "@/components/questions/question-form"
import type { QuestionFormData } from "@/components/questions/question-form"
import { questionRepository } from "@/repositories/reference-data"
import { getCategories } from "@/services/categories"
import {questionsQueryKey, useQuestions} from "@/hooks/questions/use-questions"
import { Skeleton } from "@/components/ui/skeleton"
import {toast} from "sonner";

export function QuestionsCreatePage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [error, setError] = useState("")

    const {data: categories = [], isLoading, error: categoriesError,} = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })
    const {data: questions = [], isLoading: isQuestionsLoading, error: questionsError} = useQuestions()

    function handleSave(data: QuestionFormData) {
        setError("")

        try {
            const questions = questionRepository.getAll()

            const nextId = Math.max(
                -1,
                questionRepository.getOriginal().length - 1,
                ...questions.map(question => question.id)
            ) + 1

            questionRepository.add({
                ...data,
                id: nextId,
            })

            queryClient.setQueryData(
                questionsQueryKey,
                questionRepository.getAll()
            )

            toast.success("Aanvullende vraag succesvol toegevoegd.")
            navigate({ to: "/questions" })
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Er is iets misgegaan bij het opslaan."
            )
        }
    }

    if (isLoading || isQuestionsLoading) {
        return <Skeleton className="h-96 w-full max-w-3xl" />
    }

    if (categoriesError || questionsError) {
        return (
            <p className="text-destructive">
                De categorieën konden niet worden geladen.
            </p>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <h1>Aanvullende vraag toevoegen</h1>

            {error && (
                <p role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            )}

            <QuestionForm
                categories={categories}
                questions={questions}
                onSave={handleSave}
                onCancel={() => navigate({ to: "/questions" })}
            />
        </div>
    )
}
