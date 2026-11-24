import { useState } from "react"
import type { FormEvent } from "react"
import type { Category, Question } from "@/types/domain/reference-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {IconChevronDown, IconX} from "@tabler/icons-react"
import { QuestionCategorySelector } from "./question-category-selector"
import { QuestionAnswerFields } from "./question-answer-field"
import {
    type SupportedQuestionType,
    validateQuestionKey,
    getExpressionsUsingQuestion,
    getExpressionsAffectedByAnswerChanges,
    getExpressionsAffectedByCategoryChanges,
    getNextAnswerValue
} from "@/utils/questions"
import {DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";
import type { Expression } from "@/types/domain/routing"
import { QuestionDependencyWarning } from "./question-dependency-warning"

export type QuestionFormData = Omit<Question, "id" | "fieldType"> & {
    fieldType: SupportedQuestionType
}

type QuestionFormProps = {
    question?: QuestionFormData
    categories: Category[]
    onSave: (question: QuestionFormData) => void
    onCancel: () => void
    expressions?: Expression[]
}

const fieldTypes: {
    value: SupportedQuestionType
    label: string
}[] = [
    { value: "radio_input", label: "Enkele keuze (radio)" },
    { value: "checkbox_input", label: "Meerdere keuzes (checkbox)" },
]

export function QuestionForm({question, categories, expressions = [], onSave, onCancel}: QuestionFormProps) {
    const [form, setForm] = useState<QuestionFormData>({
        key: question?.key ?? "",
        label: question?.label ?? "",
        fieldType: question?.fieldType ?? "radio_input",
        required: question?.required ?? true,
        categoryIds: [...(question?.categoryIds ?? [])],
        answers: question?.answers.map(a => ({ ...a })) ?? [],
        nextAnswerValue: getNextAnswerValue(
            question?.answers ?? [],
            question?.nextAnswerValue
        ),
    })
    const [error, setError] = useState("")

    const hasKeyChanged = question !== undefined && question.key !== form.key.trim()

    const affectedByKeyChange =
        question && hasKeyChanged
            ? getExpressionsUsingQuestion(question.key, expressions)
            : []
    const affectedByAnswerChanges =
        question && !hasKeyChanged
            ? getExpressionsAffectedByAnswerChanges(question, form.answers, expressions)
            : []
    const affectedByCategoryChanges =
        question && !hasKeyChanged
            ? getExpressionsAffectedByCategoryChanges(question, form.categoryIds, categories, expressions)
            : []

    const hasDependencyWarnings = affectedByKeyChange.length > 0 || affectedByAnswerChanges.length > 0 || affectedByCategoryChanges.length > 0

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")

        const key = form.key.trim()
        const label = form.label.trim()

        if (!label) {
            setError("Vul een vraagtekst in.")
            return
        }

        if (!question || key !== question.key) {
            const keyError = validateQuestionKey(key)

            if (keyError) {
                setError(keyError)
                return
            }
        }

        const answers = form.answers.map(answer => ({
            value: answer.value.trim(),
            label: answer.label.trim(),
        }))

        if (answers.length === 0) {
            setError("Voeg minimaal één antwoordoptie toe.")
            return
        }

        if (answers.some(a => !a.value || !a.label)) {
            setError("Vul alle antwoordopties in.")
            return
        }

        const values = answers.map(a => a.value)

        if (new Set(values).size !== values.length) {
            setError("Antwoordwaarden moeten uniek zijn.")
            return
        }

        onSave({
            ...form,
            key,
            label,
            answers,
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-3xl flex-col gap-6"
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        {question
                            ? "Aanvullende vraag bewerken"
                            : "Aanvullende vraag toevoegen"}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Configureer de vraag, categorieën en antwoorden.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Formulier sluiten"
                    onClick={onCancel}
                >
                    <IconX />
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="question-key"
                        className="text-sm font-medium"
                    >
                        Key *
                    </label>

                    <Input
                        id="question-key"
                        value={form.key}
                        onChange={e => setForm(current => ({
                            ...current,
                            key: e.target.value,
                        }))}
                        placeholder="Bijv. Straatverlichting_type"
                        required
                    />

                    <p className="text-xs text-muted-foreground">
                        Unieke identifier van de vraag.
                        Gebruik letters, cijfers en underscores.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="question-type"
                        className="text-sm font-medium"
                    >
                        Vraagtype *
                    </label>


                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-between"
                            >
                                {fieldTypes.find(
                                    type => type.value === form.fieldType
                                )?.label}

                                <IconChevronDown className="size-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="start"
                            className="w-(--radix-dropdown-menu-trigger-width)"
                        >
                            <DropdownMenuRadioGroup
                                value={form.fieldType}
                                onValueChange={value => setForm(current => ({
                                    ...current,
                                    fieldType: value as SupportedQuestionType,
                                }))}
                            >
                                {fieldTypes.map(type => (
                                    <DropdownMenuRadioItem
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="question-label"
                    className="text-sm font-medium"
                >
                    Vraagtekst *
                </label>

                <Input
                    id="question-label"
                    value={form.label}
                    onChange={e => setForm(current => ({
                        ...current,
                        label: e.target.value,
                    }))}
                    placeholder="Bijv. Waar gaat uw melding over?"
                    required
                />
            </div>

            <div className="flex items-center gap-3 rounded-md border p-4">
                <Checkbox
                    id="question-required"
                    checked={form.required}
                    onCheckedChange={checked => setForm(current => ({
                        ...current,
                        required: checked === true,
                    }))}
                />

                <label
                    htmlFor="question-required"
                    className="cursor-pointer text-sm"
                >
                    Deze vraag is verplicht
                </label>
            </div>

            <QuestionCategorySelector
                categories={categories}
                selectedIds={form.categoryIds}
                onChange={categoryIds => {
                    setForm(current => ({
                        ...current,
                        categoryIds,
                    }))
                }}
            />

            <QuestionAnswerFields
                answers={form.answers}
                nextAnswerValue={getNextAnswerValue(form.answers, form.nextAnswerValue)}
                onChange={(answers, nextAnswerValue) =>
                    setForm(current => ({
                        ...current,
                        answers,
                        nextAnswerValue,
                    }))
                }
            />

            <QuestionDependencyWarning
                expressions={affectedByKeyChange}
                title="De oorspronkelijke key wordt gebruikt in bestaande routeringen."
                description="Door de key te wijzigen, verwijzen onderstaande routing expressions niet meer naar deze vraag."
            />
            <QuestionDependencyWarning
                expressions={affectedByAnswerChanges}
                title="Gewijzigde antwoorden worden gebruikt in bestaande routeringen."
                description="Je hebt een antwoordoptie gewijzigd of verwijderd. Dit kan gevolgen hebben voor onderstaande routing expressions."
            />
            <QuestionDependencyWarning
                expressions={affectedByCategoryChanges}
                title="Verwijderde categoriekoppelingen worden mogelijk gebruikt in bestaande routeringen."
                description="Door de gewijzigde categoriekoppelingen werken onderstaande routing expressions mogelijk niet meer zoals bedoeld. Controleer deze routeringen na het opslaan."
            />

            {error && (
                <p role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            )}

            <div className="flex justify-end gap-3 border-t pt-5">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Annuleren
                </Button>

                <Button type="submit">
                    {hasDependencyWarnings
                        ? "Toch wijzigingen opslaan"
                        : question
                            ? "Wijzigingen opslaan"
                            : "Vraag toevoegen"}
                </Button>
            </div>
        </form>
    )
}