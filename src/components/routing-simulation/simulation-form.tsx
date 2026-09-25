import {Separator} from "@/components/ui/separator.tsx";
import {useRoutingSimulationForm} from "@/hooks/use-routing-simulation-form.ts";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useQuery} from "@tanstack/react-query";
import {getCategories} from "@/services/categories.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Link} from "@tanstack/react-router";
import {getAreas} from "@/services/areas.tsx";
import {getQuestions} from "@/services/questions-answers.tsx";
import {getQuestionCategorySlugs, simulateRouting} from "@/utils/routing-simulations.ts";
import type {SimulationFormProps} from "@/types/routing-simulations.ts";
import {getRoutingExpressions} from "@/services/routing-expressions.tsx";
import {getExpressions} from "@/services/expressions.tsx";

export function SimulationForm({onSimulationComplete, }: SimulationFormProps) {
    const form = useRoutingSimulationForm()

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

    const { data: routingExpressions = [], isLoading: isRoutingExpressionsLoading, error: routingExpressionsError,} = useQuery(
        {
            queryKey: ["routingExpressions"],
            queryFn: getRoutingExpressions,
        })

    const { data: expressions = [], isLoading: isExpressionsLoading, error: expressionsError,} = useQuery(
        {
            queryKey: ["expressions"],
            queryFn: getExpressions,
        })

    const localExpressions = JSON.parse(localStorage.getItem("expressions") ?? "[]")

    const localRoutingExpressions = JSON.parse(localStorage.getItem("routingExpressions") ?? "[]")

    const isLoading = isCategoriesLoading || isAreasLoading || isQuestionsLoading || isRoutingExpressionsLoading || isExpressionsLoading
    const hasError = categoriesError || areasError || questionsError || routingExpressionsError || expressionsError

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
                                                        key={`${category.parent}-${category.slug}`}
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
                    <form.Field name={"area"}>
                        {(field) => (
                            <div className={"flex flex-row gap-4 items-center"}>
                                <label htmlFor={field.name}>Gebied: </label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button type="button" variant="outline">
                                            {field.state.value || "Selecteer een gebied"}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {areas.map((area) => (
                                            <DropdownMenuItem
                                                key={area.name}
                                                onSelect={() => {
                                                    field.handleChange(area.name)
                                                }}
                                            >
                                                {area.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </form.Field>
                    <form.Subscribe selector={(state) => state.values.category}>
                        {(selectedCategory) => (
                            <form.Field name="question">
                                {(field) => {
                                    const relevantQuestions = questions.filter((question) =>
                                        getQuestionCategorySlugs(question).includes(selectedCategory)
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
                                                        {field.state.value || "Selecteer een vraag"}
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
                                                            {question.key}
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

                            const meta = JSON.parse(selectedQuestion.meta)
                            const values = meta.values ?? {}

                            if (Object.keys(values).length === 0) {
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
                                                        {values[field.state.value] ?? "Selecteer een antwoord"}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {Object.entries(values).map(
                                                        ([value, label]) => (
                                                            <DropdownMenuItem
                                                                key={value}
                                                                onSelect={() => {
                                                                    field.handleChange(value)
                                                                }}
                                                            >
                                                                {label as string}
                                                            </DropdownMenuItem>
                                                        )
                                                    )}
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
                                    routingExpressions,
                                    expressions,
                                    categories,
                                    areas,
                                    questions,
                                    localRoutingExpressions,
                                    localExpressions
                                )

                                console.log("Simulation results:", results)

                                onSimulationComplete(results)
                            }}
                        >
                            Testen
                        </Button>
                        <Button variant={"secondary"} size={"lg"} className={"flex-1"}>Annuleren</Button>
                    </div>
                </form>
            </div>
        </>
    )
}