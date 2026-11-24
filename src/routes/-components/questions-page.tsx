import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { QuestionsTable } from "@/components/ui/questions-table"
import {QuestionForm, type QuestionFormData,} from "@/components/questions/question-form"
import { getCategories } from "@/services/categories"
import { questionRepository } from "@/repositories/reference-data"
import {useQuestions, questionsQueryKey} from "@/hooks/questions/use-questions"
import type { Question } from "@/types/domain/reference-data"
import {toast} from "sonner";
import {isSupportedQuestion} from "@/utils/questions.ts";
import { getExpressionsUsingQuestion } from "@/utils/questions"
import { useExpressions } from "@/hooks/import-export/use-expressions"
import { QuestionDependencyWarning } from "@/components/questions/question-dependency-warning"

export function QuestionsPage() {
    const queryClient = useQueryClient()

    const [globalFilter, setGlobalFilter] = useState("")
    const [editingQuestion, setEditingQuestion] = useState<(Question & QuestionFormData) | null>(null)
    const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null)
    const [error, setError] = useState("")

    const {data: expressions = [], isLoading: isExpressionsLoading, error: expressionsError} = useExpressions()

    const {data: questions = [], isLoading: isQuestionsLoading, error: questionsError,} = useQuestions()

    const {data: categories = [], isLoading: isCategoriesLoading, error: categoriesError,
    } = useQuery({
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

    const dependentExpressions = deletingQuestion
        ? getExpressionsUsingQuestion(deletingQuestion.key, expressions)
        : []

    function refreshQuestions() {
        queryClient.setQueryData(
            questionsQueryKey,
            questionRepository.getAll()
        )
    }

    function handleEdit(question: Question) {
        if (!isSupportedQuestion(question)) return

        setError("")
        setDeletingQuestion(null)
        setEditingQuestion(question)
    }

    function handleUpdate(data: QuestionFormData) {
        if (!editingQuestion) return

        try {
            questionRepository.update({
                ...data,
                id: editingQuestion.id,
            })

            refreshQuestions()
            setEditingQuestion(null)
            setError("")
            toast.success("Aanvullende vraag succesvol bewerkt.")
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "De vraag kon niet worden opgeslagen."
            )
        }
    }

    function handleDelete() {
        if (!deletingQuestion) return

        try {
            questionRepository.remove(deletingQuestion.id)

            refreshQuestions()
            setDeletingQuestion(null)
            setError("")
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

            {deletingQuestion && (
                <div className="rounded-lg border p-4">
                    <p className="font-medium">
                        Aanvullende vraag verwijderen?
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Weet je zeker dat je "{deletingQuestion.label}"
                        wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
                    </p>
                    {dependentExpressions.length > 0 && (
                        <div className="mt-4">
                            <QuestionDependencyWarning
                                expressions={dependentExpressions}
                                title={`Deze vraag wordt gebruikt in ${
                                    dependentExpressions.length
                                } ${
                                    dependentExpressions.length === 1
                                        ? "routing expression"
                                        : "routing expressions"
                                }.`}
                                description="Het verwijderen van deze vraag kan ervoor zorgen dat onderstaande routeringen niet meer correct werken."
                            />
                        </div>
                    )}

                    <div className="mt-4 flex gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            {dependentExpressions.length > 0
                                ? "Toch verwijderen"
                                : "Verwijderen"}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingQuestion(null)}
                        >
                            Annuleren
                        </Button>
                    </div>
                </div>
            )}

            {editingQuestion && (
                <QuestionForm
                    key={editingQuestion.id}
                    question={editingQuestion}
                    categories={categories}
                    expressions={expressions}
                    onSave={handleUpdate}
                    onCancel={() => {
                        setEditingQuestion(null)
                        setError("")
                    }}
                />
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
                            globalFilter={globalFilter}
                            categories={categories}
                            onEdit={handleEdit}
                            onDelete={question => {
                                setError("")
                                setEditingQuestion(null)
                                setDeletingQuestion(question)
                            }}
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
