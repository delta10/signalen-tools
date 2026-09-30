import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useRoutingExpressionForm} from "@/hooks/forms/routing-expressions.ts";
import {GeneralFields} from "@/components/expressions/general-fields.tsx";
import {ConditionsBuilder} from "@/components/expressions/conditions-builder.tsx";
import {DestinationsField} from "@/components/expressions/destinations-field.tsx";

export function CreateForm() {
    const form = useRoutingExpressionForm()

    return (
        <form className={"flex flex-col justify-start items-start gap-2"}
            onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
        }}>
            <GeneralFields form={form} />

            <Separator className={"my-4"} />

            <ConditionsBuilder form={form} />

            <Separator className={"my-4"} />

            <DestinationsField form={form} />

            <p className={"text-muted-foreground my-4"}>* Verplicht Veld</p>
            <Button type="submit">
                Opslaan
            </Button>
        </form>
    )
}