import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import type { RuleGroupType } from "react-querybuilder"
import { toast } from "sonner"

import type { RoutingExpressionFormData } from "@/types/forms/create-expression"
import type { Expression } from "@/types/domain/routing"

import { useExpressionActions } from "@/hooks/import-export/use-expressions"
import { getDepartments } from "@/services/departments"
import { getCategories } from "@/services/categories"

import { validateRoutingQuery } from "@/utils/validate-routing-query"
import { mapRoutingQueryToCode } from "@/mappers/query-to-expression"

const defaultValues: RoutingExpressionFormData = {
    name: "",
    order: 0,
    isActive: true,
    department: "",
    conditions: {
        combinator: "and",
        rules: [],
    },
}

export function useRoutingExpressionForm() {
    const navigate = useNavigate()
    const { add } = useExpressionActions()

    const { data: departments } = useQuery({
        queryKey: ["departments"],
        queryFn: getDepartments,
    })

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    return useForm({
        defaultValues,

        onSubmit: async ({ value }) => {
            if (!departments || !categories) {
                toast.error("De benodigde gegevens zijn niet geladen.")
                return
            }

            if (!value.name.trim() || !value.department) {
                toast.error("Vul de verplichte velden in.")
                return
            }

            const query = value.conditions as RuleGroupType
            const issues = validateRoutingQuery(query, { categories })

            if (issues.length > 0) {
                toast.error(issues[0].message)
                return
            }

            const department = departments.find(
                (item) => item.code === value.department
            )

            if (!department) {
                toast.error("Selecteer een geldige afdeling.")
                return
            }

            try {
                const code = mapRoutingQueryToCode(query, { categories })

                const newExpression: Expression = {
                    id: crypto.randomUUID(),
                    name: value.name.trim(),
                    code,
                    type: "routing",
                    isActive: value.isActive,
                    routing: {
                        department,
                        order: value.order,
                    },
                }

                add(newExpression)

                toast.success("Routeringsregel succesvol toegevoegd")

                await navigate({
                    to: "/routing-expressions",
                })
            } catch (error) {
                console.error("Failed to create routing expression:", error)
                toast.error("De routeringsregel kon niet worden opgeslagen.")
            }
        },
    })
}