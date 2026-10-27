import { useState } from "react"
import { ValueEditor, type ValueEditorProps } from "react-querybuilder"
import { IconChevronDown, IconChevronRight, IconX } from "@tabler/icons-react"
import type { Area, Category, Question } from "@/types/domain/reference-data"
import type {CategoryCondition, CategoryRuleValue,} from "@/types/forms/create-expression"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { SearchableMultiSelect } from "@/components/expressions/create-nested-conditions/searchable-multi-select"
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible"

type EditorContext = {
    categories: Category[]
    questions: Question[]
    areas: Area[]
}

const emptyValue: CategoryRuleValue = {
    categories: [],
}

function CategoryFields({props, categories, questions,}: {
    props: ValueEditorProps
    categories: Category[]
    questions: Question[]
}) {
    const [questionsOpen, setQuestionsOpen] = useState(false)
    const [openCategory, setOpenCategory] = useState<string | null>(null)

    const value: CategoryRuleValue =
        props.value &&
        typeof props.value === "object" &&
        !Array.isArray(props.value) &&
        Array.isArray(props.value.categories)
            ? props.value as CategoryRuleValue
            : emptyValue

    const selectedCategories = value.categories.map(
        (condition) => condition.category
    )

    const availableCategories = value.categories.map((condition) => {
        const category = categories.find(
            (item) => String(item.id) === condition.category
        )

        const availableQuestions = questions.filter(
            (question) =>
                category !== undefined &&
                question.categorySlugs.includes(category.slug) &&
                ["radio_input", "checkbox_input"].includes(question.fieldType)
        )

        return { category, condition, availableQuestions }}).filter(
            (item) => item.category && item.availableQuestions.length > 0
    )

    const configuredCount = value.categories.filter(
        (condition) => condition.question && condition.answer
    ).length

    function updateCondition(updated: CategoryCondition) {
        props.handleOnChange({
            categories: value.categories.map((condition) =>
                condition.category === updated.category
                    ? updated
                    : condition
            ),
        })
    }

    return (
        <div className="flex min-w-0 flex-col gap-4">

            {/* Categories */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                    Waar gaat de melding over?
                </label>
                <SearchableMultiSelect
                    options={categories.map((category) => ({
                        value: String(category.id),
                        label: category.name,
                        searchTerms: category.slug,
                    }))}
                    value={selectedCategories}
                    onChange={(slugs) => {
                        props.handleOnChange({
                            categories: slugs.map((slug) =>
                                    value.categories.find((item) => item.category === slug) ?? {
                                        category: slug,
                                        question: "",
                                        answer: "",
                                    }
                            ),
                        })
                    }}
                    placeholder="Selecteer categorieën"
                    searchPlaceholder="Zoek categorie..."
                    disabled={props.disabled}
                    selectedLabel={"categorieën"}
                />
                {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((slug) => (
                            <Badge key={slug} variant="secondary">
                                {categories.find((category) => String(category.id) === slug )?.name ?? slug}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Additional questions */}
            {availableCategories.length > 0 && (
                <Collapsible
                    open={questionsOpen}
                    onOpenChange={setQuestionsOpen}
                >
                    <CollapsibleTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full max-w-md justify-between"
                        >
                            Aanvullende vragen (optioneel)
                            <div className="flex items-center gap-2">
                                {configuredCount > 0 && (
                                    <Badge variant="secondary">
                                        {configuredCount} ingesteld
                                    </Badge>
                                )}
                                {questionsOpen
                                    ? <IconChevronDown size={16} />
                                    : <IconChevronRight size={16} />}
                            </div>
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 pt-3">
                        {availableCategories.map((item) => {
                            const { category, condition, availableQuestions } = item
                            const selectedQuestion = availableQuestions.find(
                                (q) => q.key === condition.question
                            )
                            const isOpen = openCategory === condition.category

                            return (
                                <Collapsible
                                    key={condition.category}
                                    open={isOpen}
                                    onOpenChange={(open) =>
                                        setOpenCategory(open ? condition.category : null)
                                    }
                                >
                                    <div className="rounded-md border p-3">
                                        <CollapsibleTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="w-full justify-between"
                                            >
                                                {category?.name}
                                                <div className="flex items-center gap-2">
                                                    {condition.question && condition.answer && (
                                                        <Badge variant="secondary">
                                                            Ingesteld
                                                        </Badge>
                                                    )}
                                                    {isOpen
                                                        ? <IconChevronDown size={16} />
                                                        : <IconChevronRight size={16} />}
                                                </div>
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="space-y-3 pt-3">
                                            <div className="flex items-center gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <SearchableSelect
                                                        options={availableQuestions.map((q) => ({
                                                            value: q.key,
                                                            label: q.label,
                                                            searchTerms: q.key,
                                                        }))}
                                                        value={condition.question}
                                                        onChange={(question) =>
                                                            updateCondition({
                                                                ...condition,
                                                                question,
                                                                answer: "",
                                                            })
                                                        }
                                                        placeholder="Selecteer aanvullende vraag"
                                                        searchPlaceholder="Zoek vraag..."
                                                        disabled={props.disabled}
                                                    />
                                                </div>
                                                {condition.question && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={props.disabled}
                                                        aria-label="Verwijder aanvullende vraag"
                                                        onClick={() =>
                                                            updateCondition({
                                                                ...condition,
                                                                question: "",
                                                                answer: "",
                                                            })
                                                        }
                                                    >
                                                        <IconX size={16} />
                                                    </Button>
                                                )}
                                            </div>
                                            {selectedQuestion && (
                                                <SearchableSelect
                                                    options={selectedQuestion.answers.map((answer) => ({
                                                        value: answer.value,
                                                        label: answer.label,
                                                    }))}
                                                    value={condition.answer}
                                                    onChange={(answer) =>
                                                        updateCondition({ ...condition, answer })
                                                    }
                                                    placeholder="Selecteer antwoord"
                                                    searchPlaceholder="Zoek antwoord..."
                                                    disabled={props.disabled}
                                                />
                                            )}
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>
                            )
                        })}
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    )
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
                    selectedLabel={"gebieden"}
                />

                {selectedAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {selectedAreas.map((code) => {
                            const area = areas.find((a) => a.code === code)

                            return (
                                <Badge key={code} variant="secondary">
                                    {area?.name ?? code}
                                </Badge>
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

    return (
        <CategoryFields
            props={props}
            categories={categories}
            questions={questions}
        />
    )
}