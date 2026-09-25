import type {useRoutingExpressionForm} from "@/hooks/use-routing-expressions-form.ts";
import {Input} from "@/components/ui/input.tsx";
import {Switch} from "@/components/ui/switch.tsx";

type GeneralFieldsProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
}
export function GeneralFields({form}: GeneralFieldsProps) {
    return(
        <>
            <h2>Informatie</h2>
            <form.Field name={"name"} validators={{
                onChange: ({ value }) =>
                    !value.trim() ? "Naam is verplicht" : undefined
            }}>
                {(field) => (
                    <div className="w-full max-w-sm">
                        <label htmlFor="name" className="text-sm font-medium">
                            Naam
                            <span className={"text-destructive"}> *</span>
                        </label>
                        <Input
                            id={"name"}
                            value={field.state.value}
                            onChange={(event) => field.handleChange(event.target.value)}
                        />
                        {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-destructive">
                                {field.state.meta.errors[0]}
                            </p>
                        )}
                    </div>
                )}
            </form.Field>
            <form.Field name={"order"} validators={{
                onChange: ({ value }) =>
                    value === undefined || value === null
                        ? "Order is verplicht"
                        : undefined
            }}>
                {(field) => (
                    <div className="w-full max-w-sm">
                        <label htmlFor="order" className="text-sm font-medium">
                            Order
                            <span className={"text-destructive"}> *</span>
                        </label>
                        <Input
                            id={"order"}
                            type={"number"}
                            min={0}
                            value={field.state.value}
                            onChange={(event) => field.handleChange(Number(event.target.value))}
                        />
                        {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-destructive">
                                {field.state.meta.errors[0]}
                            </p>
                        )}
                    </div>
                )}
            </form.Field>
            <form.Field name="isActive">
                {(field) => (
                    <div className="flex flex-col justify-start gap-2">
                        <label htmlFor="isActive" className="text-sm font-medium">Actief</label>
                        <Switch id="isActive"
                                checked={field.state.value}
                                onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                    </div>
                )}
            </form.Field>
        </>
    )
}