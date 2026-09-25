import { useForm } from "@tanstack/react-form"
import type { RoutingExpressionFormData } from "@/types/routing-expressions-create"
import {convertRoutingExpressionFormData} from "@/utils/routing-expressions-create.ts";
import {useNavigate} from "@tanstack/react-router";
import {useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

const defaultValues: RoutingExpressionFormData = {
    name: "",
    order: 0,
    isActive: true,
    conditions: [
        {
            id: crypto.randomUUID(),
            type: "",
            categories: "",
            areas: "",
            questions: "",
        },
    ],
    department: "",
}

export function useRoutingExpressionForm() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    return useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            const result = convertRoutingExpressionFormData(value)

            // Temporary storage
            const existingExpressions =
                JSON.parse(localStorage.getItem("newExpressions") ?? "[]")

            const existingRoutingExpressions =
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