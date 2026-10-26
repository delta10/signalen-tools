import {ValueEditor, type ValueEditorProps,} from "react-querybuilder"
import type {Area, Category, Question,} from "@/types/domain/reference-data"
import type { CategoryRuleValue } from "@/types/forms/create-expression"
import { Button } from "@/components/ui/button"
import {IconX} from "@tabler/icons-react"
import {SearchableSelect} from "@/components/ui/searchable-select.tsx";
import {SearchableMultiSelect} from "@/components/expressions/searchable-multi-select.tsx";
import {Badge} from "@/components/ui/badge"

type EditorContext = {
    categories: Category[]
    questions: Question[]
    areas: Area[]
}

const emptyValue: CategoryRuleValue = {
    category: "",
    question: "",
    answer: "",
}

export function CategoryValueEditor(props: ValueEditorProps) {
    const { categories, questions, areas } = props.context as EditorContext

    if (props.field === "area") {
        const selectedAreas: string[] = Array.isArray(props.value)
            ? props.value.filter(
                (value): value is string => typeof value === "string"
            )
            : typeof props.value === "string" && props.value !== ""
                ? [props.value]
                : []

        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                    In welke gebieden geldt deze routering?
                </label>
                <SearchableMultiSelect
                    options={areas.map((area) => ({
                        value: area.code,
                        label: area.name,
                        searchTerms: area.code,
                    }))}
                    value={selectedAreas}
                    onChange={props.handleOnChange}
                    placeholder="Selecteer gebieden"
                    searchPlaceholder="Zoek gebieden..."
                    disabled={props.disabled}
                />
                {selectedAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {selectedAreas.map((code) => {
                            const area = areas.find((area) => area.code === code)

                            return (
                                <div>
                                    <Badge key={code} variant="secondary">
                                        {area?.name ?? code}
                                    </Badge>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        )
    }

    if (props.field !== "category") {
        return <ValueEditor {...props} />
    }


    const value: CategoryRuleValue =
        typeof props.value === "object" &&
        props.value !== null &&
        !Array.isArray(props.value)
            ? props.value as CategoryRuleValue
            : emptyValue

    const availableQuestions = questions.filter(
        (question) =>
            question.categorySlugs.includes(value.category) &&
            ["radio_input", "checkbox_input"].includes(question.fieldType)
    )

    const selectedQuestion = availableQuestions.find(
        (question) => question.key === value.question
    )

    return (
        <div className="flex flex-col gap-4">
            {/* Category */}
            <SearchableSelect
                options={categories.map((category) => ({
                    value: category.slug,
                    label: category.name,
                    searchTerms: category.slug,
                }))}
                value={value.category}
                onChange={(category) =>
                    props.handleOnChange({
                        category,
                        question: "",
                        answer: "",
                    })
                }
                placeholder="Selecteer categorie"
                searchPlaceholder="Zoek categorie..."
                disabled={props.disabled}
            />

            {/* Question */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                    Aanvullende vraag toevoegen (optioneel)
                </label>

                <div className="flex w-full max-w-md items-center gap-2">
                    <div className="min-w-0 flex-1">
                        <SearchableSelect
                            options={availableQuestions.map((question) => ({
                                value: question.key,
                                label: question.label,
                                searchTerms: question.key,
                            }))}
                            value={value.question}
                            onChange={(question) =>
                                props.handleOnChange({
                                    ...value,
                                    question,
                                    answer: "",
                                })
                            }
                            placeholder={
                                !value.category
                                    ? "Selecteer eerst een categorie"
                                    : availableQuestions.length === 0
                                        ? "Geen aanvullende vragen beschikbaar"
                                        : "Selecteer aanvullende vraag"
                            }
                            searchPlaceholder="Zoek vraag..."
                            disabled={
                                props.disabled ||
                                !value.category ||
                                availableQuestions.length === 0
                            }
                        />
                    </div>
                    {value.question && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            disabled={props.disabled}
                            onClick={() =>
                                props.handleOnChange({
                                    ...value,
                                    question: "",
                                    answer: "",
                                })
                            }
                            aria-label="Verwijder aanvullende vraag"
                        >
                            <IconX size={16} />
                        </Button>
                    )}
                </div>
            </div>

            {/* Answer */}
            {selectedQuestion && (
                <SearchableSelect
                    options={selectedQuestion.answers.map((answer) => ({
                        value: answer.value,
                        label: answer.label,
                    }))}
                    value={value.answer}
                    onChange={(answer) =>
                        props.handleOnChange({
                            ...value,
                            answer,
                        })
                    }
                    placeholder="Selecteer antwoord"
                    searchPlaceholder="Zoek antwoord..."
                    disabled={props.disabled}
                />
            )}
        </div>
    )
}