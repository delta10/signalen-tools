import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"
import { IconArrowLeft } from "@tabler/icons-react"
import { useExpressions } from "@/hooks/import-export/use-expressions"
import { getCategories } from "@/services/categories"
import { parseRoutingExpression } from "@/utils/parse-routing-expression"
import { Button } from "@/components/ui/button"
import { CreateForm } from "@/components/expressions/create-form"
import type { RoutingExpressionFormData } from "@/types/forms/create-expression"

export function RoutingExpressionsEditPage() {
    const { expressionId } = useParams({
        from: "/routing-expressions/$expressionId/edit",
    })

    const {data: expressions = [], isLoading: isExpressionsLoading, error: expressionsError,} = useExpressions()
    const {data: categories = [], isLoading: isCategoriesLoading, error: categoriesError,} = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    const expression = expressions.find(
        (item) => item.id === expressionId
    )

    const initialValues = useMemo<RoutingExpressionFormData | null>(() => {
        if (!expression || categories.length === 0) return null

        try {
            const conditions = parseRoutingExpression(
                expression.code,
                categories
            )

            return {
                name: expression.name,
                order: expression.routing?.order ?? 0,
                isActive: expression.isActive,
                department: expression.routing?.department.code ?? "",
                conditions,
            }
        } catch (error) {
            console.error("Failed to parse routing expression:", error)
            return null
        }
    }, [expression, categories])

    if (isExpressionsLoading || isCategoriesLoading) {
        return <p>Routing expression laden...</p>
    }

    if (expressionsError || categoriesError) {
        return <p>Er is iets misgegaan bij het laden van de gegevens.</p>
    }

    if (!expression) {
        return <p>Routing expression niet gevonden.</p>
    }

    return (
        <div className="space-y-6">
            <Button variant="ghost" asChild>
                <Link to="/routing-expressions">
                    <IconArrowLeft className="mr-2 size-4" />
                    Terug naar overzicht
                </Link>
            </Button>

            <div>
                <h1 className="text-2xl font-semibold">
                    Routing Expression bewerken
                </h1>
                <p className="text-sm text-muted-foreground">
                    {expression.name}
                </p>
            </div>

            {initialValues ? (
                <CreateForm
                    key={expression.id}
                    initialValues={initialValues}
                    expression={expression}
                />
            ) : (
                <p className="text-sm text-destructive">
                    De voorwaarden van deze routing expression
                    konden niet worden ingeladen.
                </p>
            )}
        </div>
    )
}
