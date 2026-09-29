import type { useRoutingExpressionForm } from "@/hooks/use-routing-expressions-form.ts"
import type { Questions } from "@/types/routing-expressions.ts"
import { getQuestionAnswers } from "@/utils/routing-expressions-create.ts"
import { getQuestionCategorySlugs } from "@/utils/routing-expressions-create.ts"
import { Button } from "@/components/ui/button.tsx"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu.tsx"

type QuestionConditionEditorProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
    groupIndex: number
    questions: Questions[]
}

export function QuestionConditionEditor({form, groupIndex, questions}: QuestionConditionEditorProps) {
    return (
        <form.Subscribe selector={(state) => state.values.conditionGroups}>
            {(conditionGroups) => {
                const categoryGroup = conditionGroups.find(
                    (group) => group.type === "category"
                )

                const selectedCategories = categoryGroup?.type === "category"
                        ? categoryGroup.values
                        : []

                const relevantQuestions = questions.filter((question) => {
                    const questionCategories =
                        getQuestionCategorySlugs(question)

                    return selectedCategories.some((category) =>
                        questionCategories.includes(category)
                    )
                })

                if (selectedCategories.length === 0) {
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
                            const selectedQuestion =
                                relevantQuestions.find(
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
                                                {questionField.state.value || "Selecteer vraag"}
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
                                                        {question.key}
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