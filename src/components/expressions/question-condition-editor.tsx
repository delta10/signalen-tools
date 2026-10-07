import type { useRoutingExpressionForm } from "@/hooks/forms/routing-expressions.ts"
import type { Question } from "@/types/domain/reference-data.ts"
import {getQuestionAnswers, getQuestionLabel, isSupportedQuestion} from "@/utils/routing-expressions-create.ts"
import { getQuestionCategorySlugs } from "@/utils/routing-expressions-create.ts"
import { Button } from "@/components/ui/button.tsx"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu.tsx"

type QuestionConditionEditorProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
    groupIndex: number
    questions: Question[]
}

export function QuestionConditionEditor({form, groupIndex, questions}: QuestionConditionEditorProps) {
    return (
        <form.Subscribe selector={(state) => state.values.conditionGroups}>
            {(conditionGroups) => {
                const categoryGroup = conditionGroups.find(
                    (group) => group.type === "category"
                )

                const selectedCategories = categoryGroup?.values ?? []

                const relevantQuestions = questions
                    .filter(isSupportedQuestion)
                    .filter((question) => {
                    const questionCategories =
                        getQuestionCategorySlugs(question)

                    return selectedCategories.some((category) =>
                        questionCategories.includes(category)
                    )
                })

                if (!selectedCategories.length) {
                    return (
                        <p className="text-sm text-muted-foreground">
                            Selecteer eerst een categorie.
                        </p>
                    )
                }

                if (relevantQuestions.length === 0) {
                    return (
                        <p className="text-sm text-muted-foreground">
                            Geen aanvullende vragen beschikbaar.
                        </p>
                    )
                }

                return (
                    <form.Field name={`conditionGroups[${groupIndex}].question`}>
                        {(questionField) => {
                            const selectedQuestion = relevantQuestions.find(
                                    (question) =>
                                        question.key === questionField.state.value
                                )

                            const answers = selectedQuestion
                                ? getQuestionAnswers(selectedQuestion)
                                : []

                            return (
                                <div className="flex flex-col gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button type="button" variant="outline" className="w-84">
                                                {selectedQuestion
                                                    ? getQuestionLabel(selectedQuestion)
                                                    : "Selecteer vraag"}
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent>
                                            {relevantQuestions.map(
                                                (question) => (
                                                    <DropdownMenuItem
                                                        key={question.key}
                                                        onSelect={() =>
                                                            questionField.handleChange(question.key)
                                                        }
                                                    >
                                                        {getQuestionLabel(question)}
                                                    </DropdownMenuItem>
                                                )

                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {selectedQuestion && (
                                        <form.Field name={`conditionGroups[${groupIndex}].answer`}>
                                            {(answerField) => (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button type="button" variant="outline" className="w-fit">
                                                            {answerField.state.value || "Selecteer antwoord"}
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent>
                                                        {answers.map(
                                                            (answer) => (
                                                                <DropdownMenuItem key={answer}
                                                                    onSelect={() =>
                                                                        answerField.handleChange(answer)
                                                                    }
                                                                >
                                                                    {answer}
                                                                </DropdownMenuItem>
                                                            )
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </form.Field>
                                    )}
                                </div>
                            )
                        }}
                    </form.Field>
                )
            }}
        </form.Subscribe>
    )
}