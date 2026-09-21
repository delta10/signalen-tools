import type {useRoutingExpressionForm} from "@/hooks/use-routing-expressions-form.ts";
import {Button} from "@/components/ui/button.tsx";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";
import type {ConditionType} from "@/types/routing-expressions-create.ts";
import {useQuery} from "@tanstack/react-query";
import {getCategories} from "@/services/categories.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Link} from "@tanstack/react-router";
import {getQuestions} from "@/services/questions-answers.tsx";
import {getAreas} from "@/services/areas.tsx";
import {getQuestionAnswers} from "@/utils/routing-expressions-create.ts";

type ConditionsProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
}

const conditionTypeLabels: Record<ConditionType, string> = {
    category: "Categorie",
    area: "Gebied",
    question: "Aanvullende vraag",
}

const conditionTypes = Object.entries(conditionTypeLabels) as [ConditionType, string][]

export function ConditionsBuilder({form}: ConditionsProps) {
    const { data: categories = [], isLoading: isCategoriesLoading, error: categoriesError,} = useQuery(
        {
            queryKey: ["categories"],
            queryFn: getCategories,
        })

    const { data: questions = [], isLoading: isQuestionsLoading, error: questionsError,} = useQuery(
        {
            queryKey: ["questions"],
            queryFn: getQuestions,
        })

    const { data: areas = [], isLoading: isAreasLoading, error: areasError,} = useQuery(
        {
            queryKey: ["areas"],
            queryFn: getAreas,
        })

    const isLoading = isCategoriesLoading || isQuestionsLoading || isAreasLoading
    const hasError = categoriesError || questionsError || areasError

    if(isLoading) {
        return(
            <Skeleton className={"h-12"} />
        )
    }

    if(hasError) {
        return(
            <div className="h-full flex flex-col">
                <h1>Routing Expressions</h1>
                <div className="flex flex-col items-center justify-center gap-4 flex-1">
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

    return(
        <>
            <h2>Wanneer...</h2>
            <form.Field name="conditions" mode="array">
                {(field) => (
                    <div className="flex flex-col gap-4">
                        {field.state.value.map((condition, index) => (
                            <form.Field key={condition.id} name={`conditions[${index}].type`}>
                                {(typeField) => (
                                    <>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button type="button" variant="outline">
                                                    {typeField.state.value
                                                        ? conditionTypeLabels[typeField.state.value]
                                                        : "Selecteer een type"}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {conditionTypes.map(([value, label]) => (
                                                    <DropdownMenuItem
                                                        key={value}
                                                        onSelect={() =>
                                                            typeField.handleChange(value)
                                                        }>
                                                        {label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        {typeField.state.value === "category" && (
                                            <form.Field name={`conditions[${index}].categories`}>
                                                {(categoryField) => (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button type="button" variant="outline">
                                                                {categoryField.state.value || "Selecteer categorie"}
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            {categories.map((category) => (
                                                                <DropdownMenuItem
                                                                    key={`${category.parent}-${category.slug}`}
                                                                    onSelect={() => {
                                                                        categoryField.handleChange(category.name)
                                                                    }}>
                                                                    {category.name}
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </form.Field>
                                        )}
                                        {typeField.state.value === "area" && (
                                            <form.Field name={`conditions[${index}].areas`}>
                                                {(areaField) => (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button type="button" variant="outline">
                                                                {areaField.state.value || "Selecteer gebied"}
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            {areas.map((area) => (
                                                                <DropdownMenuItem
                                                                    key={area.code}
                                                                    onSelect={() => {
                                                                        areaField.handleChange(area.code)
                                                                    }}>
                                                                    {area.name}
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </form.Field>
                                        )}
                                        {typeField.state.value === "question" && (
                                            <form.Field name={`conditions[${index}].questions`}>
                                                {(questionField) => {
                                                    const selectedQuestion = questions.find(
                                                        (question) => question.key === questionField.state.value
                                                    )

                                                    const answers = selectedQuestion
                                                        ? getQuestionAnswers(selectedQuestion)
                                                        : []
                                                    return (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button type="button" variant="outline">
                                                                    {questionField.state.value || "Selecteer vraag"}
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                {questions.map((question) => (
                                                                    <DropdownMenuItem
                                                                        key={question.key}
                                                                        onSelect={() => {
                                                                            questionField.handleChange(question.key)
                                                                        }}>
                                                                        {question.key}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )
                                                }}
                                            </form.Field>
                                        )}
                                    </>
                                )}
                            </form.Field>
                        ))}
                        <Button type="button" variant="secondary" onClick={() =>
                                field.pushValue({
                                    id: crypto.randomUUID(),
                                    type: "",
                                    categories: "",
                                    areas: "",
                                    questions: "",
                                    answers: []
                                })
                            }>
                            + Voorwaarde toevoegen
                        </Button>
                    </div>
                )}
            </form.Field>
        </>
    )
}