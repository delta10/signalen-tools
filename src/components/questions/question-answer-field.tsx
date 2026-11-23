import { useRef } from "react"
import type { QuestionAnswer } from "@/types/domain/reference-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconTrash } from "@tabler/icons-react"

type QuestionAnswerFieldsProps = {
    answers: QuestionAnswer[]
    onChange: (answers: QuestionAnswer[]) => void
}

export function QuestionAnswerFields({answers, onChange,}: QuestionAnswerFieldsProps) {
    const nextId = useRef(0)
    const rowIds = useRef<string[]>([])

    while (rowIds.current.length < answers.length) {
        rowIds.current.push(String(nextId.current++))
    }

    function addAnswer() {
        rowIds.current.push(String(nextId.current++))

        onChange([
            ...answers,
            { value: "", label: "" },
        ])
    }

    function updateAnswer(index: number, field: "value" | "label", value: string) {
        onChange(
            answers.map((answer, i) =>
                i === index
                    ? { ...answer, [field]: value }
                    : answer
            )
        )
    }

    function removeAnswer(index: number) {
        rowIds.current.splice(index, 1)

        onChange(
            answers.filter((_, i) => i !== index)
        )
    }

    return (
        <div className="flex flex-col gap-4 border-t pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="font-medium">Antwoordopties</h3>
                    <p className="text-sm text-muted-foreground">
                        Configureer de waarden en zichtbare labels.
                    </p>
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

            {answers.map((answer, index) => {
                const rowId = rowIds.current[index]

                return (
                    <div
                        key={rowId}
                        className="grid grid-cols-[1fr_1fr_auto] items-end gap-3"
                    >
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor={`answer-value-${rowId}`}
                                className="text-xs"
                            >
                                Waarde
                            </label>

                            <Input
                                id={`answer-value-${rowId}`}
                                value={answer.value}
                                onChange={e =>
                                    updateAnswer(
                                        index,
                                        "value",
                                        e.target.value
                                    )
                                }
                                placeholder="Bijv. 1"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor={`answer-label-${rowId}`}
                                className="text-xs"
                            >
                                Label
                            </label>

                            <Input
                                id={`answer-label-${rowId}`}
                                value={answer.label}
                                onChange={e =>
                                    updateAnswer(
                                        index,
                                        "label",
                                        e.target.value
                                    )
                                }
                                placeholder="Bijv. Kapotte lamp"
                            />
                        </div>

                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label={`Antwoord ${index + 1} verwijderen`}
                            onClick={() => removeAnswer(index)}
                        >
                            <IconTrash className="text-destructive" />
                        </Button>
                    </div>
                )
            })}
        </div>
    )
}
