import { useQuery } from "@tanstack/react-query"
import {QueryBuilder, type Field, type RuleGroupType} from "react-querybuilder"
import { getCategories } from "@/services/categories"
import { getAreas } from "@/services/areas"
import type { useRoutingExpressionForm } from "@/hooks/forms/routing-expressions"
import {getQuestions} from "@/services/questions-answers.tsx";
import {CategoryValueEditor} from "@/components/expressions/category-value-editor.tsx";
import {RoutingRuleCard} from "@/components/expressions/routing-rule-card.tsx";
import {RoutingGroupCard} from "@/components/expressions/routing-group-card.tsx";
import {RoutingCombinator} from "@/components/ui/routing-combinator.tsx";

type ConditionsBuilderProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
}

export function RoutingQueryBuilder({ form }: ConditionsBuilderProps) {
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    const { data: areas = [] } = useQuery({
        queryKey: ["areas"],
        queryFn: getAreas,
    })
    const { data: questions = [] } = useQuery({
        queryKey: ["questions"],
        queryFn: getQuestions,
    })

    const fields: Field[] = [
        {
            name: "category",
            label: "Categorie",
        },
        {
            name: "area",
            label: "Gebied",
            defaultValue: [],
        }
    ]

    return (
        <>
            <h2>Wanneer...</h2>
            <form.Field name="conditions">
                {(field) => (
                    <QueryBuilder
                        fields={fields}
                        query={field.state.value as RuleGroupType}
                        onQueryChange={field.handleChange}
                        context={{ categories, questions, areas }}
                        showCombinatorsBetweenRules
                        controlElements={{
                            rule: RoutingRuleCard,
                            ruleGroup: RoutingGroupCard,
                            valueEditor: CategoryValueEditor,
                            inlineCombinator: RoutingCombinator,
                            operatorSelector: () => null,
                        }}
                        operators={[
                            { name: "=", label: "is" },
                        ]}
                        combinators={[
                            { name: "and", label: "EN" },
                            { name: "or", label: "OF" },
                        ]}
                    />
                )}
            </form.Field>
        </>
    )
}