import type { useRoutingExpressionForm } from "@/hooks/use-routing-expressions-form.ts"
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

    return (
        <div className="flex items-center gap-2">
            <form.Field name={fieldName}>
                {(valueField) => (
                    <>
                        {group.type === "category" && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="outline">
                                        {valueField.state.value || "Selecteer categorie"}
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                    {categories.map((category) => (
                                        <DropdownMenuItem
                                            key={`${category.parent}-${category.slug}`}
                                            onSelect={() =>
                                                valueField.handleChange(
                                                    category.name
                                                )
                                            }
                                        >
                                            {category.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {group.type === "area" && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="outline">
                                        {valueField.state.value || "Selecteer gebied"}
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                    {areas.map((area) => (
                                        <DropdownMenuItem
                                            key={area.code}
                                            onSelect={() =>
                                                valueField.handleChange(
                                                    area.code
                                                )
                                            }
                                        >
                                            {area.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {group.type === "question" && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="outline">
                                        {valueField.state.value || "Selecteer vraag"}
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                    {questions.map((question) => (
                                        <DropdownMenuItem
                                            key={question.key}
                                            onSelect={() =>
                                                valueField.handleChange(
                                                    question.key
                                                )
                                            }
                                        >
                                            {question.key}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </>
                )}
            </form.Field>

            <Button type="button" variant="ghost" onClick={onRemove}>
                Verwijderen
            </Button>
        </div>
    )
}