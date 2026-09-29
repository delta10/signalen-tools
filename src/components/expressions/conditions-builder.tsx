import type { useRoutingExpressionForm } from "@/hooks/forms/routing-expressions.ts"
import { Button } from "@/components/ui/button.tsx"
import { useQuery } from "@tanstack/react-query"
import { getCategories } from "@/services/categories.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { Link } from "@tanstack/react-router"
import { getQuestions } from "@/services/questions-answers.tsx"
import { getAreas } from "@/services/areas.tsx"
import {ConditionGroup} from "@/components/create-routing-expression/condition-group.tsx";
import type {ConditionType} from "@/types/routing-expressions-create.ts";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";

type ConditionsProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
}

export function ConditionsBuilder({ form }: ConditionsProps) {
    const {data: categories = [], isLoading: isCategoriesLoading, error: categoriesError,} = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    const {data: questions = [], isLoading: isQuestionsLoading, error: questionsError,} = useQuery({
        queryKey: ["questions"],
        queryFn: getQuestions,
    })

    const {data: areas = [], isLoading: isAreasLoading, error: areasError,} = useQuery({
        queryKey: ["areas"],
        queryFn: getAreas,
    })

    const isLoading = isCategoriesLoading || isQuestionsLoading || isAreasLoading

    const hasError = categoriesError || questionsError || areasError

    if (isLoading) {
        return (
            <Skeleton className="h-12" />
        )
    }

    if (hasError) {
        return (
            <div className="flex h-full flex-col">
                <h1>Routing Expressions</h1>
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                    <p>Er is iets misgegaan</p>
                    <Button className="rounded-sm" size="lg" asChild>
                        <Link to="/" className="flex items-center gap-1">
                            Terug naar Home
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <h2>Wanneer...</h2>
            <form.Field name="conditionGroups" mode="array">
                {(field) => {
                    const groups = field.state.value

                    const hasCategoryGroup = groups.some(
                        (group) => group.type === "category"
                    )

                    const hasAreaGroup = groups.some(
                        (group) => group.type === "area"
                    )

                    const hasQuestionGroup = groups.some(
                        (group) => group.type === "question"
                    )

                    const addGroup = (type: ConditionType) => {
                        field.pushValue({
                            id: crypto.randomUUID(),
                            type,
                            operator: "OR",
                            conditions: [
                                {
                                    id: crypto.randomUUID(),
                                    value: "",
                                },
                            ],
                            values: [],
                            question: "",
                            answer: ""
                        })
                    }

                    return (
                        <>
                            {groups.map((group, groupIndex) => (
                                <div key={group.id} className="flex flex-col gap-4">
                                    {groupIndex > 0 && (
                                        <form.Field name="conditionOperator">
                                            {(operatorField) => (
                                                <div className="flex justify-center">
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
                                                                onSelect={() => operatorField.handleChange("AND")}
                                                            >
                                                                EN
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                onSelect={() => operatorField.handleChange("OR")}
                                                            >
                                                                OF
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            )}
                                        </form.Field>
                                    )}

                                    <ConditionGroup
                                        form={form}
                                        group={group}
                                        groupIndex={groupIndex}
                                        categories={categories}
                                        areas={areas}
                                        questions={questions}
                                        onRemove={() =>
                                            field.removeValue(groupIndex)
                                        }
                                    />
                                </div>
                            ))}

                            <div className="flex gap-2">
                                {!hasCategoryGroup && (
                                    <Button type="button" variant="secondary" onClick={() => addGroup("category")}>
                                        + Categorie
                                    </Button>
                                )}

                                {!hasAreaGroup && (
                                    <Button type="button" variant="secondary" onClick={() => addGroup("area")}>
                                        + Gebied
                                    </Button>
                                )}

                                {!hasQuestionGroup && (
                                    <Button type="button" variant="secondary" onClick={() => addGroup("question")}>
                                        + Aanvullende vraag
                                    </Button>
                                )}
                            </div>
                        </>
                    )
                }}
            </form.Field>
        </>
    )
}