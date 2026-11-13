import type { RuleGroupType, RuleType } from "react-querybuilder"
import type { Category } from "@/types/domain/reference-data"

export const categoriesFixture = [
    { id: 1, slug: "afvalbak", name: "Afvalbak" },
    { id: 2, slug: "bank", name: "Bank" },
] as Category[]

export const referenceDataFixture = {
    categories: categoriesFixture,
}

export const categoryRuleFixture: RuleType = {
    field: "category",
    operator: "=",
    value: {
        categories: [
            { category: "1", question: "", answer: "" },
        ],
    },
}

export const areaRuleFixture: RuleType = {
    field: "area",
    operator: "=",
    value: ["WK199101"],
}

export function createQuery(rules: RuleGroupType["rules"], combinator: "and" | "or" = "and",): RuleGroupType {
    return { combinator, rules }
}