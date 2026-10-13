import { useForm } from "@tanstack/react-form"
import type { RoutingExpressionFormData } from "@/types/forms/create-expression.ts"
import {useNavigate} from "@tanstack/react-router";
import {useQuery} from "@tanstack/react-query";
import {toast} from "sonner";
import {useExpressionActions} from "@/hooks/import-export/use-expressions.ts"
import {getDepartments} from "@/services/departments.tsx";
import {mapCreateExpressionFormToDomain} from "@/mappers/create-expression.ts";
import {getCategories} from "@/services/categories.tsx";

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
    const { add } = useExpressionActions()

    const { data: departments = [] } = useQuery({
        queryKey: ["departments"],
        queryFn: getDepartments,
    })

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    return useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            try {
                const newExpression = mapCreateExpressionFormToDomain(value, departments, categories)
                add(newExpression)

                toast.success("Routing Expression succesvol toegevoegd")

                await navigate({
                    to: "/routing-expressions",
                })
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Routing Expression kon niet worden toegevoegd."
                )
            }
        },
    })
}