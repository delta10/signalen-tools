import { useForm } from "@tanstack/react-form"
import type { RoutingExpressionFormData } from "@/types/forms/create-expression.ts"
import {mapCreateExpressionFormToTransfers} from "@/utils/routing-expressions-create.ts";
import {useNavigate} from "@tanstack/react-router";
import {useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import type {ExpressionTransfer, RoutingExpressionTransfer} from "@/types/import-export/expressions.ts";

const defaultValues: RoutingExpressionFormData = {
    name: "",
    order: 0,
    isActive: true,
    department: "",
    conditionGroups: [],
    conditionOperator: "AND"
}

export function useRoutingExpressionForm() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    return useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
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
            await navigate({
                to: "/routing-expressions",
            })
        },
    })
}