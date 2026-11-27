import type {Question, QuestionDependency,} from "@/types/domain/reference-data"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {IconPlus, IconTrash, IconChevronDown, IconCornerDownRight,} from "@tabler/icons-react"
import { isSupportedQuestion } from "@/utils/questions"

type QuestionDependencyEditorProps = {
    questions: Question[]
    currentQuestionKey: string
    currentQuestionLabel: string
    originalQuestionKey?: string
    categoryIds: number[]
    dependencies: QuestionDependency[]
    onChange: (dependencies: QuestionDependency[]) => void
}

export function QuestionDependencyEditor({
                                             questions,
                                             currentQuestionKey,
                                             currentQuestionLabel,
                                             originalQuestionKey,
                                             categoryIds,
                                             dependencies,
                                             onChange,
                                         }: QuestionDependencyEditorProps) {
    const isFollowUp = dependencies.length > 0

    const relevantQuestions = questions
        .filter(isSupportedQuestion)
        .filter(question =>
            question.key !== currentQuestionKey &&
            question.key !== originalQuestionKey
        )
        .filter(question =>
            question.categoryIds.some(id =>
                categoryIds.includes(id)
            )
        )

    const canAddDependency =
        !dependencies.some(
            dependency => !dependency.questionKey
        ) &&
        relevantQuestions.some(
            question => !dependencies.some(
                dependency =>
                    dependency.questionKey === question.key
            )
        )

    function addDependency() {
        onChange([
            ...dependencies,
            {
                questionKey: "",
                answerValues: [],
            },
        ])
    }

    function removeDependency(index: number) {
        onChange(
            dependencies.filter((_, i) => i !== index)
        )
    }

    function updateDependency(index: number, dependency: QuestionDependency) {
        onChange(
            dependencies.map((current, i) =>
                i === index ? dependency : current
            )
        )
    }

    function toggleAnswer(index: number, value: string) {
        const dependency = dependencies[index]

        updateDependency(index, {
            ...dependency,
            answerValues: dependency.answerValues.includes(value)
                ? dependency.answerValues.filter(
                    answer => answer !== value
                )
                : [...dependency.answerValues, value],
        })
    }

    return (
        <div className="flex flex-col gap-4 border-t pt-5">
            <div>
                <h3 className="font-medium">
                    Wanneer wordt deze vraag gesteld?
                </h3>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
                <Button
                    type="button"
                    variant={!isFollowUp ? "default" : "outline"}
                    onClick={() => onChange([])}
                >
                    Standaardvraag
                </Button>

                <Button
                    type="button"
                    variant={isFollowUp ? "default" : "outline"}
                    disabled={
                        !isFollowUp &&
                        relevantQuestions.length === 0
                    }
                    onClick={() => {
                        if (!isFollowUp) addDependency()
                    }}
                >
                    Vervolgvraag
                </Button>
            </div>
            {isFollowUp && (
                <>
                    {dependencies.map((dependency, index) => {
                        const selectedQuestion = questions.find(
                            question =>
                                question.key === dependency.questionKey
                        )

                        const availableQuestions =
                            relevantQuestions.filter(question =>
                                question.key === dependency.questionKey ||
                                !dependencies.some(item =>
                                    item.questionKey === question.key
                                )
                            )

                        if (!isFollowUp && relevantQuestions.length === 0) {
                            return null
                        }

                        return (
                            <div
                                key={index}
                                className="flex flex-col gap-3"
                            >
                                {index > 0 && (
                                    <p className="text-center text-sm font-medium text-muted-foreground">
                                        OF
                                    </p>
                                )}

                                <div className="flex min-w-0 flex-col gap-4 rounded-md border bg-muted/30 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            Na vraag:
                                        </span>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeDependency(index)
                                            }
                                        >
                                            <IconTrash className="text-destructive" />
                                        </Button>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full min-w-0 justify-between bg-background"
                                            >
                                                <span className="truncate">
                                                    {selectedQuestion?.label ||
                                                        dependency.questionKey ||
                                                        "Selecteer een bestaande vraag..."}
                                                </span>

                                                <IconChevronDown className="size-4 shrink-0 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                            align="start"
                                            className="max-h-60 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto"
                                        >
                                            {availableQuestions.length === 0 && (
                                                <p className="p-2 text-sm text-muted-foreground">
                                                    Geen beschikbare vragen.
                                                </p>
                                            )}

                                            {availableQuestions.map(question => (
                                                <DropdownMenuItem
                                                    key={question.key}
                                                    onSelect={() =>
                                                        updateDependency(index, {
                                                            questionKey: question.key,
                                                            answerValues:
                                                                question.key === dependency.questionKey
                                                                    ? dependency.answerValues
                                                                    : [],
                                                        })
                                                    }
                                                >
                                                    <span className="min-w-0 whitespace-normal">
                                                        {question.label}

                                                        <span className="block text-xs text-muted-foreground">
                                                            {question.key}
                                                        </span>
                                                    </span>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {selectedQuestion && (
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm font-medium">
                                                Als de melder antwoordt met:
                                            </p>

                                            {selectedQuestion.answers.map(answer => (
                                                <label
                                                    key={answer.value}
                                                    className="flex cursor-pointer items-start gap-3 rounded-md border bg-background p-3 text-sm"
                                                >
                                                    <Checkbox
                                                        className="mt-0.5 shrink-0"
                                                        checked={dependency.answerValues.includes(
                                                            answer.value
                                                        )}
                                                        onCheckedChange={() =>
                                                            toggleAnswer(
                                                                index,
                                                                answer.value
                                                            )
                                                        }
                                                    />

                                                    <span>
                                                        {answer.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {dependency.answerValues
                                        .filter(value =>
                                            !selectedQuestion?.answers.some(
                                                answer => answer.value === value
                                            )
                                        )
                                        .map(value => (
                                            <div
                                                key={value}
                                                className="flex items-center justify-between rounded-md border p-2 text-sm"
                                            >
                                                <span>
                                                    Onbekende antwoordwaarde: {value}
                                                </span>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        toggleAnswer(index, value)
                                                    }
                                                >
                                                    <IconTrash />
                                                </Button>
                                            </div>
                                        ))}

                                    {dependency.questionKey &&
                                        dependency.answerValues.length > 0 && (
                                            <div className="flex items-start gap-3 rounded-md border bg-background p-4">
                                                <IconCornerDownRight className="size-5 shrink-0 text-muted-foreground" />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-muted-foreground">
                                                        Dan verschijnt:
                                                    </p>

                                                    <p className="mt-1 break-words text-sm font-medium">
                                                        {currentQuestionLabel.trim() ||
                                                            "Jouw nieuwe vraag"}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )
                    })}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        disabled={!canAddDependency}
                        onClick={addDependency}
                    >
                        <IconPlus />
                        Voorwaarde toevoegen
                    </Button>
                </>
            )}
        </div>
    )
}