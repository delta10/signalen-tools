import { useQuery } from "@tanstack/react-query"
import {QueryBuilder, type Field, type RuleGroupType} from "react-querybuilder"
import { getCategories } from "@/services/categories.tsx"
import { getAreas } from "@/services/areas.tsx"
import type { useRoutingExpressionForm } from "@/hooks/forms/routing-expressions.ts"
import {getQuestions} from "@/services/questions-answers.tsx";
import {CategoryValueEditor} from "@/components/expressions/create-nested-conditions/category-value-editor.tsx";
import {RoutingRuleCard} from "@/components/expressions/create-nested-conditions/routing-rule-card.tsx";
import {RoutingGroupCard} from "@/components/expressions/create-nested-conditions/routing-group-card.tsx";
import {RoutingCombinator} from "@/components/ui/routing-combinator.tsx";
import {RoutingFieldSelector} from "@/components/expressions/create-nested-conditions/routing-field-selector.tsx";
import {RoutingRemoveRule} from "@/components/expressions/create-nested-conditions/routing-remove-rule.tsx";

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
            defaultValue: {
                categories: [],
            }
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
                            fieldSelector: RoutingFieldSelector,
                            removeRuleAction: RoutingRemoveRule,
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