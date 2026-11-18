import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRoutingExpressionForm } from "@/hooks/forms/routing-expressions"
import { GeneralFields } from "@/components/expressions/general-fields"
import { DestinationsField } from "@/components/expressions/destinations-field"
import { RoutingQueryBuilder } from "@/components/expressions/create-nested-conditions/query-builder"

import type { RoutingExpressionFormData } from "@/types/forms/create-expression"
import type { Expression } from "@/types/domain/routing"

type CreateFormProps = {
    initialValues?: RoutingExpressionFormData
    expression?: Expression
}

export function CreateForm({initialValues, expression,}: CreateFormProps) {
    const form = useRoutingExpressionForm({
        initialValues,
        expression,
    })

    return (
        <form
            className="flex w-full min-w-0 flex-col items-start gap-2"
            onSubmit={(e) => {
                e.preventDefault()
                void form.handleSubmit()
            }}
        >
            <GeneralFields form={form} />

            <Separator className="my-4" />

            <div className="w-full min-w-0">
                <RoutingQueryBuilder form={form} />
            </div>

            <Separator className="my-4" />

            <DestinationsField form={form} />

            <p className="text-muted-foreground my-4">
                * Verplicht veld
            </p>

            <Button type="submit">
                {expression ? "Wijzigingen opslaan" : "Opslaan"}
            </Button>
        </form>
    )
}