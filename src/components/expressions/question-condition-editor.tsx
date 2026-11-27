import type { useRoutingExpressionForm } from "@/hooks/forms/routing-expressions.ts"
import type {Category, Question} from "@/types/domain/reference-data.ts"
import { getQuestionsForCategories } from "@/utils/questions"
import { Button } from "@/components/ui/button.tsx"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu.tsx"

type QuestionConditionEditorProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
    groupIndex: number
    questions: Question[]
    categories: Category[]
}

export function QuestionConditionEditor({form, groupIndex, questions, categories}: QuestionConditionEditorProps) {
    return (
        <form.Subscribe selector={(state) => state.values.conditionGroups}>
            {(conditionGroups) => {
                const categoryGroup = conditionGroups.find(
                    (group) => group.type === "category"
                )

                const selectedCategories = categoryGroup?.values ?? []
                const relevantQuestions = getQuestionsForCategories(questions, categories, selectedCategories)

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

                            const answers = selectedQuestion?.answers ?? []

                            return (
                                <div className="flex flex-col gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button type="button" variant="outline" className="w-84">
                                                {selectedQuestion
                                                    ? selectedQuestion.label
                                                    : "Selecteer vraag"}
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent>
                                            {relevantQuestions.map(
                                                (question) => (
                                                    <DropdownMenuItem
                                                        key={question.key}
                                                        onSelect={() => {
                                                            if (questionField.state.value !== question.key) {
                                                                questionField.handleChange(question.key)
                                                                form.setFieldValue(
                                                                    `conditionGroups[${groupIndex}].answer`,
                                                                    ""
                                                                )
                                                            }
                                                        }}
                                                    >
                                                        {question.label}
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
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="w-fit"
                                                        >
                                                            {answers.find(
                                                                answer => answer.value === answerField.state.value
                                                            )?.label ?? "Selecteer antwoord"}
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent>
                                                        {answers.map(answer => (
                                                            <DropdownMenuItem
                                                                key={answer.value}
                                                                onSelect={() =>
                                                                    answerField.handleChange(answer.value)
                                                                }
                                                            >
                                                                {answer.label}
                                                            </DropdownMenuItem>
                                                        ))}
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