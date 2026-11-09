import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useRoutingExpressionForm} from "@/hooks/forms/routing-expressions.ts";
import {GeneralFields} from "@/components/expressions/general-fields.tsx";
import {ConditionsBuilder} from "@/components/expressions/conditions-builder.tsx";
import {DestinationsField} from "@/components/expressions/destinations-field.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Label} from "@/components/ui/label.tsx";
import {validateManualExpression} from "@/utils/validate-manual-expression.ts";

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

            <form.Field name="inputMode">
                {(modeField) => (
                    <div className="flex w-full flex-col gap-4">
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={
                                    modeField.state.value === "visual"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => modeField.handleChange("visual")}
                            >
                                Voorwaarden opstellen
                            </Button>

                            <Button
                                type="button"
                                variant={
                                    modeField.state.value === "manual"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => modeField.handleChange("manual")}
                            >
                                Code invoeren
                            </Button>
                        </div>

                        {modeField.state.value === "visual" ? (
                            <ConditionsBuilder form={form} />
                        ) : (
                            <form.Field name="manualCode">
                                {(field) => {
                                    const error = field.state.value
                                        ? validateManualExpression(field.state.value)
                                        : undefined

                                    return (
                                        <div className="flex w-full max-w-2xl flex-col gap-2">
                                            <Label htmlFor="manualCode">
                                                Expression-code
                                            </Label>

                                            <Textarea
                                                id="manualCode"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder={'sub == "Afvalbak"'}
                                                className="min-h-48 font-mono"
                                                aria-invalid={Boolean(error)}
                                            />

                                            {error && (
                                                <p className="text-sm text-destructive" role="alert">
                                                    {error}
                                                </p>
                                            )}

                                            <p className={"text-muted-foreground text-sm"}>
                                                Voer alleen de expression-code in, zonder JSON-object.<br />
                                                Dit is de "oude" methode, zoals je wellicht nog gewend bent.
                                            </p>
                                        </div>
                                    )
                                }}
                            </form.Field>
                        )}
                    </div>
                )}
            </form.Field>

            <Separator className={"my-4"} />

            <DestinationsField form={form} />

            <p className={"text-muted-foreground my-4"}>* Verplicht Veld</p>
            <Button type="submit">
                Opslaan
            </Button>
        </form>
    )
}