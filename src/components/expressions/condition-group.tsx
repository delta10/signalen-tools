import {Button} from "@/components/ui/button.tsx";
import type {Area, Questions} from "@/types/routing-expressions.ts";
import type {Category, RoutingConditionGroup} from "@/types/routing-expressions-create.ts";
import type {useRoutingExpressionForm} from "@/hooks/use-routing-expressions-form.ts";
import {CategoryMultiSelect} from "@/components/create-routing-expression/category-multiselect.tsx";
import {AreaMultiSelect} from "@/components/create-routing-expression/area-multiselect.tsx";
import {QuestionConditionEditor} from "@/components/create-routing-expression/question-condition-editor.tsx";

type ConditionGroupProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
    group: RoutingConditionGroup
    groupIndex: number
    categories: Category[]
    areas: Area[]
    questions: Questions[]
    onRemove: () => void
}

const groupLabels = {
    category: "Categorie",
    area: "Gebied",
    question: "Aanvullende vraag",
}

export function ConditionGroup({form, group, groupIndex, categories, areas, questions, onRemove}: ConditionGroupProps) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <h3>{groupLabels[group.type]}</h3>
                <Button type="button" variant="ghost" onClick={onRemove}>
                    -
                </Button>
            </div>

            {group.type === "category" && (
                <CategoryMultiSelect form={form} groupIndex={groupIndex} categories={categories} />
            )}

            {group.type === "area" && (
                <AreaMultiSelect form={form} groupIndex={groupIndex} areas={areas} />
            )}

            {group.type === "question" && (
                <QuestionConditionEditor form={form} groupIndex={groupIndex} questions={questions} />
            )}

        </div>
    )
}