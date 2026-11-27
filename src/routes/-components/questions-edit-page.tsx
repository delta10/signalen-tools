import { useState } from "react"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { IconArrowLeft } from "@tabler/icons-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {QuestionForm, type QuestionFormData,} from "@/components/questions/question-form"
import {useQuestions, questionsQueryKey,} from "@/hooks/questions/use-questions"
import { useExpressions } from "@/hooks/import-export/use-expressions"
import { questionRepository } from "@/repositories/reference-data"
import { getCategories } from "@/services/categories"
import { isSupportedQuestion } from "@/utils/questions"

export function QuestionsEditPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [error, setError] = useState("")

    const { questionId } = useParams({
        from: "/questions/$questionId/edit",
    })

    const {data: questions = [], isLoading: isQuestionsLoading, error: questionsError} = useQuestions()
    const {data: expressions = [], isLoading: isExpressionsLoading, error: expressionsError} = useExpressions()

    const {data: categories = [], isLoading: isCategoriesLoading, error: categoriesError} = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories
    })

    const question = questions.find(
        item => item.id === Number(questionId)
    )

    function handleSave(data: QuestionFormData) {
        if (!question) return
        setError("")

        try {
            questionRepository.update({
                ...data,
                id: question.id,
            })

            queryClient.setQueryData(
                questionsQueryKey,
                questionRepository.getAll()
            )

            toast.success("Aanvullende vraag succesvol bewerkt.")
            navigate({ to: "/questions" })
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "De vraag kon niet worden opgeslagen."
            )
        }
    }

    if (isQuestionsLoading || isCategoriesLoading || isExpressionsLoading) {
        return <Skeleton className="h-96 w-full max-w-3xl" />
    }

    if (questionsError || categoriesError || expressionsError) {
        return (
            <p className="text-destructive">
                Er is iets misgegaan bij het laden van de gegevens.
            </p>
        )
    }

    return (
        <div className="space-y-6">
            <Button variant="ghost" asChild>
                <Link to="/questions">
                    <IconArrowLeft className="mr-2 size-4" />
                    Terug naar overzicht
                </Link>
            </Button>
            <div>
                <h1>Aanvullende vraag bewerken</h1>
                {question && (
                    <p className="text-sm text-muted-foreground">
                        {question.label}
                    </p>
                )}
            </div>

            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
            {!question ? (
                <p>Aanvullende vraag niet gevonden.</p>
            ) : !isSupportedQuestion(question) ? (
                <p>Dit vraagtype wordt niet ondersteund.</p>
            ) : (
                <QuestionForm
                    key={question.id}
                    question={question}
                    categories={categories}
                    expressions={expressions}
                    onSave={handleSave}
                    onCancel={() =>
                        navigate({ to: "/questions" })
                    }
                />
            )}
        </div>
    )
}