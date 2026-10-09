import {Separator} from "@/components/ui/separator.tsx";
import {useRoutingSimulationForm} from "@/hooks/use-routing-simulation-form.ts";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useQuery} from "@tanstack/react-query";
import {getCategories} from "@/services/categories.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Link, useNavigate} from "@tanstack/react-router";
import {getAreas} from "@/services/areas.tsx";
import {getQuestions} from "@/services/questions-answers.tsx";
import {getSelectedRoutingExpression, simulateRouting} from "@/utils/routing-simulations.ts";
import type {SimulationFormProps} from "@/types/routing-simulations.ts";
import {getRoutingDomainExpressions} from "@/services/routing-domain-expressions.ts";

export function SimulationForm({onSimulationComplete, }: SimulationFormProps) {
    const form = useRoutingSimulationForm()
    const navigate = useNavigate()

    const { data: categories = [], isLoading: isCategoriesLoading, error: categoriesError,} = useQuery(
        {
            queryKey: ["categories"],
            queryFn: getCategories,
        })

    const { data: areas = [], isLoading: isAreasLoading, error: areasError,} = useQuery(
        {
            queryKey: ["areas"],
            queryFn: getAreas,
        })

    const { data: questions = [], isLoading: isQuestionsLoading, error: questionsError,} = useQuery(
        {
            queryKey: ["questions"],
            queryFn: getQuestions,
        })

    const { data: expressions = [], isLoading: isExpressionsLoading, error: expressionsError,} = useQuery(
        {
            queryKey: ["routing-domain-expressions"],
            queryFn: getRoutingDomainExpressions,
        })

    const isLoading = isCategoriesLoading || isAreasLoading || isQuestionsLoading || isExpressionsLoading
    const hasError = categoriesError || areasError || questionsError || expressionsError

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
            <div className="flex h-full flex-col">
                <h1>Melding maken</h1>

                <Separator className={"my-4"}/>

                <form className={"flex flex-col flex-1 gap-4"}
                      onSubmit={(e) => {
                          e.preventDefault()
                          form.handleSubmit()
                      }}>
                    <form.Field name="category">
                        {(field) => {
                            const selectedCategory = categories.find(
                                (category) => category.slug === field.state.value
                            )

                            return (
                                <>
                                    <div className={"flex flex-row gap-4 items-center"}>
                                        <label htmlFor={field.name}>Categorie: </label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button type="button" variant="outline">
                                                    {selectedCategory?.name ?? "Selecteer een categorie"}
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent>
                                                {categories.map((category) => (
                                                    <DropdownMenuItem
                                                        key={category.id}
                                                        onSelect={() => {
                                                            field.handleChange(category.slug)

                                                            form.setFieldValue("question", "")
                                                            form.setFieldValue("answer", "")
                                                        }}
                                                    >
                                                        {category.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </>
                            )
                        }}
                    </form.Field>
                    <form.Field name="area">
                        {(field) => {
                            const selectedArea = areas.find(
                                (area) => area.code === field.state.value
                            )

                            return (
                                <div className="flex flex-row gap-4 items-center">
                                    <label>Gebied:</label>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button type="button" variant="outline">
                                                {selectedArea?.name ?? "Selecteer een gebied"}
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent>
                                            {areas.map((area) => (
                                                <DropdownMenuItem key={area.code}
                                                    onSelect={() =>
                                                        field.handleChange(area.code)
                                                    }
                                                >
                                                    {area.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )
                        }}
                    </form.Field>
                    <form.Subscribe selector={(state) => state.values.category}>
                        {(selectedCategory) => (
                            <form.Field name="question">
                                {(field) => {
                                    const relevantQuestions = questions.filter((question) =>
                                        question.categorySlugs.includes(selectedCategory)
                                    )

                                    if (relevantQuestions.length === 0) {
                                        return null
                                    }

                                    return (
                                        <>
                                            <label htmlFor={field.name}>
                                                Aanvullende vraag:
                                            </label>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button type="button" variant="outline">
                                                        {relevantQuestions.find(
                                                            (question) => question.key === field.state.value
                                                        )?.label ?? "Selecteer een vraag"}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {relevantQuestions.map((question) => (
                                                        <DropdownMenuItem
                                                            key={question.key}
                                                            onSelect={() => {
                                                                field.handleChange(question.key)
                                                                form.setFieldValue("answer", "")
                                                            }}
                                                        >
                                                            {question.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </>
                                    )
                                }}
                            </form.Field>
                        )}
                    </form.Subscribe>
                    <form.Subscribe selector={(state) => state.values.question}>
                        {(selectedQuestionKey) => {
                            const selectedQuestion = questions.find(
                                (question) => question.key === selectedQuestionKey
                            )

                            if (!selectedQuestion) {
                                return null
                            }

                            const answers = selectedQuestion.answers
                            if (answers.length === 0) {
                                return null
                            }

                            return (
                                <form.Field name="answer">
                                    {(field) => (
                                        <>
                                            <label htmlFor={field.name}>
                                                Antwoord:
                                            </label>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button type="button" variant="outline">
                                                        {answers.find(
                                                            (answer) => answer.value === field.state.value
                                                        )?.label ?? "Selecteer een antwoord"}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {answers.map((answer) => (
                                                        <DropdownMenuItem key={answer.value}
                                                            onSelect={() => field.handleChange(answer.value)}
                                                        >
                                                            {answer.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </>
                                    )}
                                </form.Field>
                            )
                        }}
                    </form.Subscribe>

                    <Separator className={"my-4"}/>

                    <div className="mt-auto flex items-center justify-center gap-4">
                        <Button type="button" size="lg" className="flex-1" onClick={() => {
                                const value = form.state.values

                                const results = simulateRouting(
                                    value,
                                    expressions,
                                    categories,
                                    areas,
                                    questions,
                                )

                            const selectedRoutingExpression = getSelectedRoutingExpression(results)
                            onSimulationComplete(value, results, selectedRoutingExpression)
                            }}
                        >
                            Testen
                        </Button>
                        <Button variant={"secondary"} size={"lg"} className={"flex-1"} onClick={() => {
                            navigate({to: "/routing-expressions",})
                        }}
                        >Annuleren</Button>
                    </div>
                </form>
            </div>
        </>
    )
}