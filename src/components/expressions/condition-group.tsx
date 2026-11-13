import {Button} from "@/components/ui/button.tsx";
import type {Area, Question, Category} from "@/types//domain/reference-data.ts";
import type {RoutingConditionGroup} from "@/types/forms/create-expression.ts";
import type {useRoutingExpressionForm} from "@/hooks/forms/routing-expressions.ts";
import {CategoryMultiSelect} from "@/components/expressions/category-multiselect.tsx";
import {AreaMultiSelect} from "@/components/expressions/area-multiselect.tsx";
import {QuestionConditionEditor} from "@/components/expressions/question-condition-editor.tsx";

type ConditionGroupProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
    group: RoutingConditionGroup
    groupIndex: number
    categories: Category[]
    areas: Area[]
    questions: Question[]
    onRemove: () => void
}

const groupLabels = {
    category: "Categorie",
    area: "Gebied",
    question: "Aanvullende vraag",
}

export function ConditionGroup({form, group, groupIndex, categories, areas, questions, onRemove}: ConditionGroupProps) {
    const renderConditionEditor = () => {
        switch (group.type) {
            case "category":
                return (
                    <CategoryMultiSelect
                        form={form}
                        groupIndex={groupIndex}
                        categories={categories}
                    />
                )

            case "area":
                return (
                    <AreaMultiSelect
                        form={form}
                        groupIndex={groupIndex}
                        areas={areas}
                    />
                )

            case "question":
                return (
                    <QuestionConditionEditor
                        form={form}
                        groupIndex={groupIndex}
                        questions={questions}
                    />
                )
        }
    }

    return (
        <div className="flex flex-col gap-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <h3>{groupLabels[group.type]}</h3>
                <Button type="button" variant="ghost" onClick={onRemove}>
                    -
                </Button>
            </div>

            {renderConditionEditor()}

        </div>
    )
}