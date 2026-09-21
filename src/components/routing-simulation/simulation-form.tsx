import {Separator} from "@/components/ui/separator.tsx";
import {useRoutingSimulationForm} from "@/hooks/use-routing-simulation-form.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useQuery} from "@tanstack/react-query";
import {getCategories} from "@/services/categories.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Link} from "@tanstack/react-router";
import {getAreas} from "@/services/areas.tsx";
import {getQuestions} from "@/services/questions-answers.tsx";
import {getQuestionCategorySlugs} from "@/utils/routing-simulations.ts";

export function SimulationForm() {
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

    const isLoading = isCategoriesLoading || isAreasLoading || isQuestionsLoading
    const hasError = categoriesError || areasError || questionsError

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
            <h1>Melding maken</h1>

            <Separator className={"my-4"}/>

            <form className={"flex flex-col gap-4"}
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
                                                }}
                                            >
                                                {category.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                                    <div className="flex flex-row items-center gap-4">
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
                                                        }}
                                                    >
                                                        {question.key}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )
                            }}
                        </form.Field>
                    )}
                </form.Subscribe>
            </form>
        </>
    )
}