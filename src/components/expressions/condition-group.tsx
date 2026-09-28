import {Button} from "@/components/ui/button.tsx";
import {ConditionRow} from "@/components/create-routing-expression/condition-row.tsx";
import type {Area, Questions} from "@/types/routing-expressions.ts";
import type {Category, RoutingConditionGroup} from "@/types/routing-expressions-create.ts";
import type {useRoutingExpressionForm} from "@/hooks/use-routing-expressions-form.ts";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";

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

const addLabels = {
    category: "Categorie toevoegen",
    area: "Gebied toevoegen",
    question: "Antwoord toevoegen",
}

export function ConditionGroup({form, group, groupIndex, categories, areas, questions, onRemove,}: ConditionGroupProps) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <h3>{groupLabels[group.type]}</h3>
                <Button type="button" variant="ghost" onClick={onRemove}>
                    -
                </Button>
            </div>

            <form.Field name={`conditionGroups[${groupIndex}].conditions`} mode="array">
                {(field) => (
                    <div className="flex flex-col gap-3">
                        {field.state.value.map((condition, conditionIndex) => (
                            <div key={condition.id} className="flex flex-col gap-2">
                                {conditionIndex > 0 && (
                                    <form.Field name={`conditionGroups[${groupIndex}].operator`}>
                                        {(operatorField) => (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button type="button" variant="ghost" size="sm">
                                                        {operatorField.state.value === "AND"
                                                            ? "EN"
                                                            : "OF"}
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        onSelect={() =>
                                                            operatorField.handleChange("AND")
                                                        }
                                                    >
                                                        EN
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onSelect={() =>
                                                            operatorField.handleChange("OR")
                                                        }
                                                    >
                                                        OF
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </form.Field>
                                )}

                                <ConditionRow
                                    form={form}
                                    group={group}
                                    groupIndex={groupIndex}
                                    conditionIndex={conditionIndex}
                                    categories={categories}
                                    areas={areas}
                                    questions={questions}
                                    onRemove={() =>
                                        field.removeValue(conditionIndex)
                                    }
                                />
                            </div>
                        ))}

                        <Button type="button" variant="secondary" className="w-fit" onClick={() =>
                                field.pushValue({
                                    id: crypto.randomUUID(),
                                    value: "",
                                })
                            }
                        >
                            + {addLabels[group.type]}
                        </Button>
                    </div>
                )}
            </form.Field>
        </div>
    )
}