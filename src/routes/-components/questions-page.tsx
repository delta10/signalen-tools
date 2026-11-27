import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { QuestionsTable } from "@/components/ui/questions-table"
import { getCategories } from "@/services/categories"
import { questionRepository } from "@/repositories/reference-data"
import {useQuestions, questionsQueryKey} from "@/hooks/questions/use-questions"
import type { Question } from "@/types/domain/reference-data"
import {toast} from "sonner";
import {isSupportedQuestion} from "@/utils/questions.ts";
import { useExpressions } from "@/hooks/import-export/use-expressions"

export function QuestionsPage() {
    const queryClient = useQueryClient()
    const [globalFilter, setGlobalFilter] = useState("")
    const [error, setError] = useState("")

    const {data: expressions = [], isLoading: isExpressionsLoading, error: expressionsError} = useExpressions()
    const {data: questions = [], isLoading: isQuestionsLoading, error: questionsError,} = useQuestions()
    const {data: categories = [], isLoading: isCategoriesLoading, error: categoriesError} = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    const categoryNames = new Map(
        categories.map(category => [category.id, category.name])
    )

    const supportedQuestions = questions.filter(isSupportedQuestion)

    const filteredQuestions = supportedQuestions.filter(question => {
        const searchable = [
            question.label,
            question.key,
            question.fieldType,
            ...question.answers.flatMap(answer => [
                answer.label,
                answer.value,
            ]),
            ...question.categoryIds.map(
                id => categoryNames.get(id) ?? String(id)
            ),
        ].join(" ").toLowerCase()

        return searchable.includes(globalFilter.trim().toLowerCase())
    })

    function refreshQuestions() {
        queryClient.setQueryData(
            questionsQueryKey,
            questionRepository.getAll()
        )
    }

    function handleDelete(question: Question) {
        setError("")
        try {
            questionRepository.remove(question.id)
            refreshQuestions()

            toast.success("Aanvullende vraag succesvol verwijderd.")
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "De vraag kon niet worden verwijderd."
            )
        }
    }

    const queryError = questionsError || categoriesError || expressionsError

    if (queryError) {
        return (
            <div className="flex flex-col gap-4">
                <h1>Aanvullende vragen</h1>

                <p role="alert" className="text-destructive">
                    {queryError instanceof Error
                        ? queryError.message
                        : String(queryError)}
                </p>
            </div>
        )
    }

    if (isQuestionsLoading || isCategoriesLoading || isExpressionsLoading) {
        return <Skeleton className="h-12 w-full" />
    }

    return (
        <div className="flex min-w-0 flex-col gap-6">
            <div>
                <h1>Aanvullende vragen</h1>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <Input
                        className="w-full max-w-sm"
                        placeholder="Zoeken..."
                        aria-label="Aanvullende vragen zoeken"
                        value={globalFilter}
                        onChange={event =>
                            setGlobalFilter(event.target.value)
                        }
                    />

                    <Button
                        className="rounded-sm"
                        size="lg"
                        asChild
                    >
                        <Link to="/questions/create">
                            <IconPlus data-icon="inline-start" />
                            Aanvullende vraag toevoegen
                        </Link>
                    </Button>
                </div>
            </div>

            {error && (
                <p role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            )}

            <div>
                {supportedQuestions.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-16 text-center">
                        <p>Er zijn nog geen ondersteunde aanvullende vragen.</p>

                        <Button asChild>
                            <Link to="/questions/create">
                                <IconPlus />
                                Eerste vraag toevoegen
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <QuestionsTable
                            questions={filteredQuestions}
                            allQuestions={questions}
                            globalFilter={globalFilter}
                            categories={categories}
                            expressions={expressions}
                            onDelete={handleDelete}
                        />

                        <p className="mt-3 text-sm text-muted-foreground">
                            {filteredQuestions.length} van{" "}
                            {supportedQuestions.length} vragen
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}