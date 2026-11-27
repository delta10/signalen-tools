import type { QuestionAnswer } from "@/types/domain/reference-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconTrash } from "@tabler/icons-react"

type QuestionAnswerFieldsProps = {
    answers: QuestionAnswer[]
    nextAnswerValue: number
    onChange: (
        answers: QuestionAnswer[],
        nextAnswerValue: number
    ) => void
}

export function QuestionAnswerFields({answers, nextAnswerValue, onChange,}: QuestionAnswerFieldsProps) {
    function addAnswer() {
        onChange(
            [...answers,
                {
                    value: String(nextAnswerValue),
                    label: "",
                },
            ], nextAnswerValue + 1
        )
    }

    function updateAnswer(value: string, label: string) {
        onChange(
            answers.map(answer =>
                answer.value === value
                    ? { ...answer, label }
                    : answer
            ),
            nextAnswerValue
        )
    }

    function removeAnswer(value: string) {
        onChange(
            answers.filter(answer => answer.value !== value),
            nextAnswerValue
        )
    }

    return (
        <div className="flex flex-col gap-4 border-t pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="font-medium">Antwoordopties:</h3>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAnswer}
                >
                    <IconPlus />
                    Antwoord toevoegen
                </Button>
            </div>

            {answers.length === 0 && (
                <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                    Nog geen antwoordopties toegevoegd.
                </p>
            )}

            {answers.map((answer, index) => (
                <div
                    key={answer.value}
                    className="flex items-center gap-3"
                >
                    <span className="w-6 shrink-0 text-sm text-muted-foreground">
                        {index + 1}.
                    </span>

                    <Input
                        value={answer.label}
                        aria-label={`Antwoordoptie ${index + 1}`}
                        onChange={event =>
                            updateAnswer(
                                answer.value,
                                event.target.value
                            )
                        }
                        placeholder="Vul een antwoordoptie in..."
                    />

                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label={`Antwoord ${index + 1} verwijderen`}
                        onClick={() => removeAnswer(answer.value)}
                    >
                        <IconTrash className="text-destructive" />
                    </Button>
                </div>
            ))}
        </div>
    )
}