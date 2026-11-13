import { useForm } from "@tanstack/react-form"
import type { RoutingExpressionFormData } from "@/types/forms/create-expression.ts"
import {mapCreateExpressionFormToTransfers} from "@/mappers/form-to-transfer.ts";
import {useNavigate} from "@tanstack/react-router";
import {useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import type {ExpressionTransfer, RoutingExpressionTransfer} from "@/types/import-export/expressions.ts";
import {validateManualExpression} from "@/utils/validate-manual-expression.ts";
import { useRef } from "react"

export type SaveAction =
    | "save"
    | "save-and-test"
    | "save-and-new"
    | "save-and-duplicate"

const defaultValues: RoutingExpressionFormData = {
    name: "",
    order: 0,
    isActive: true,
    department: "",
    conditionGroups: [],
    conditionOperator: "AND",
    inputMode: "visual",
    manualCode: "",
}

export function useRoutingExpressionForm() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const saveActionRef = useRef<SaveAction>("save")

    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            if (value.inputMode === "manual") {
                const error = validateManualExpression(value.manualCode)

                if (error) {
                    toast.error(error)
                    return
                }
            }

            const result = mapCreateExpressionFormToTransfers(value)

            // Temporary storage
            const existingExpressions: ExpressionTransfer[] =
                JSON.parse(localStorage.getItem("newExpressions") ?? "[]")

            const existingRoutingExpressions: RoutingExpressionTransfer[] =
                JSON.parse(localStorage.getItem("newRoutingExpressions") ?? "[]")

            localStorage.setItem(
                "newExpressions",
                JSON.stringify([
                    ...existingExpressions,
                    result.expression,
                ])
            )

            localStorage.setItem(
                "newRoutingExpressions",
                JSON.stringify([
                    ...existingRoutingExpressions,
                    result.routingExpression,
                ])
            )

            await queryClient.invalidateQueries({
                queryKey: ["expressions"],
            })

            await queryClient.invalidateQueries({
                queryKey: ["routing-expressions"],
            })

            toast.success("Routing Expression succesvol toegevoegd")

            const action = saveActionRef.current
            saveActionRef.current = "save"

            switch (action) {
                case "save-and-test":
                    await navigate({
                        to: "/routing-expressions/simulate",
                    })
                    break

                case "save-and-new":
                    form.reset()
                    break

                case "save-and-duplicate":
                    form.setFieldValue("name", "")
                    break

                default:
                    await navigate({
                        to: "/routing-expressions",
                    })
            }
        },
    })
    const submitWithAction = (action: SaveAction) => {
        if (form.state.isSubmitting) return

        saveActionRef.current = action
        return form.handleSubmit()
    }

    return {form, submitWithAction}
}

export type RoutingExpressionForm =
    ReturnType<typeof useRoutingExpressionForm>["form"]