import { useForm } from "@tanstack/react-form"
import type { RoutingExpressionFormData } from "@/types/routing-expressions-create"

const defaultValues: RoutingExpressionFormData = {
    name: "",
    order: 0,
    isActive: true,
    conditions: [
        {
            id: crypto.randomUUID(),
            type: "",
            categories: []
        },
    ],
    department: "",
}

export function useRoutingExpressionForm() {
    return useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            console.log(value)
        },
    })
}