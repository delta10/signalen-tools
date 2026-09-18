import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useRoutingExpressionForm} from "@/hooks/use-routing-expressions-form.ts";
import {GeneralFields} from "@/components/create-routing-expression/general-fields.tsx";
import {ConditionsBuilder} from "@/components/create-routing-expression/conditions-builder.tsx";

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

            <p className={"text-muted-foreground my-4"}>* Verplicht Veld</p>
            <Button type="submit">
                Opslaan
            </Button>
        </form>
    )
}