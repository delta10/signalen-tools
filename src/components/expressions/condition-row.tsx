import type { useRoutingExpressionForm } from "@/hooks/forms/routing-expressions.ts"
import type {Category, RoutingConditionGroup,} from "@/types/routing-expressions-create.ts"
import type {Area, Questions,} from "@/types/routing-expressions.ts"
import { Button } from "@/components/ui/button.tsx"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu.tsx"

type ConditionRowProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
    group: RoutingConditionGroup
    groupIndex: number
    conditionIndex: number
    categories: Category[]
    areas: Area[]
    questions: Questions[]
    onRemove: () => void
}

export function ConditionRow({form, group, groupIndex, conditionIndex, categories, areas, questions, onRemove,}: ConditionRowProps) {
    const fieldName = `conditionGroups[${groupIndex}].conditions[${conditionIndex}].value` as const

    const getOptions = () => {
        switch (group.type) {
            case "category":
                return {
                    placeholder: "Selecteer categorie",
                    options: categories.map((category) => ({
                        key: `${category.parent}-${category.slug}`,
                        value: category.slug,
                        label: category.name,
                    })),
                }

            case "area":
                return {
                    placeholder: "Selecteer gebied",
                    options: areas.map((area) => ({
                        key: area.code,
                        value: area.code,
                        label: area.name,
                    })),
                }

            case "question":
                return {
                    placeholder: "Selecteer vraag",
                    options: questions.map((question) => ({
                        key: question.key,
                        value: question.key,
                        label: question.key,
                    })),
                }

            default:
                return {
                    placeholder: "",
                    options: [],
                }
        }
    }

    const {placeholder, options} = getOptions()

    return (
        <div className="flex items-center gap-2">
            <form.Field name={fieldName}>
                {(valueField) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type="button" variant="outline">
                                {valueField.state.value || placeholder}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            {options.map((option) => (
                                <DropdownMenuItem
                                    key={option.key}
                                    onSelect={() =>
                                        valueField.handleChange(option.value)
                                    }
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </form.Field>

            <Button type="button" variant="ghost" onClick={onRemove}>
                Verwijderen
            </Button>
        </div>
    )
}