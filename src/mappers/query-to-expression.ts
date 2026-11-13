import type { RuleGroupType, RuleType } from "react-querybuilder"
import type { Category } from "@/types/domain/reference-data"
import type { CategoryRuleValue } from "@/types/forms/create-expression"

type ReferenceData = {
    categories: Category[]
}

export function mapRoutingQueryToCode(query: RuleGroupType, data: ReferenceData,): string {
    return mapGroupToCode(query, data)
}

function mapGroupToCode(group: RuleGroupType, data: ReferenceData): string {
    if (group.rules.length === 0) {
        throw new Error("Cannot map an empty group")
    }

    if (group.combinator !== "and" && group.combinator !== "or") {
        throw new Error("Unsupported group combinator")
    }

    const conditions = group.rules.map((rule) => {
        if ("rules" in rule) {
            return mapGroupToCode(rule as RuleGroupType, data)
        }

        return mapRuleToCode(rule as RuleType, data)
    })

    return `(${conditions.join(` ${group.combinator} `)})`
}

function mapRuleToCode(rule: RuleType, data: ReferenceData,): string {
    switch (rule.field) {
        case "category":
            return mapCategoryRuleToCode(rule.value, data.categories)

        case "area":
            return mapAreaRuleToCode(rule.value)

        default:
            throw new Error(`Unsupported field: ${rule.field}`)
    }
}

function mapCategoryRuleToCode(value: unknown, categories: Category[],): string {
    const categoryValue = value as CategoryRuleValue

    if (!Array.isArray(categoryValue?.categories) ||
        categoryValue.categories.length === 0) {
        throw new Error("No categories selected")
    }

    const conditions = categoryValue.categories.map((condition) => {
        const category = categories.find(
            (item) => String(item.id) === condition.category
        )

        if (!category) {
            throw new Error(`Unknown category: ${condition.category}`)
        }

        const categoryCode = `sub == ${JSON.stringify(category.name)}`

        if (!condition.question) {
            if (condition.answer) {
                throw new Error("Answer selected without a question")
            }

            return categoryCode
        }

        if (!condition.answer) {
            throw new Error(`Missing answer for ${category.name}`)
        }

        const questionCode =
            `${condition.question} == ${JSON.stringify(condition.answer)}`

        return `(${categoryCode} and ${questionCode})`
    })

    return `(${conditions.join(" or ")})`
}

function mapAreaRuleToCode(value: unknown): string {
    if (!Array.isArray(value) || value.length === 0) {
        throw new Error("No areas selected")
    }

    const conditions = value.map((code) => {
        if (typeof code !== "string" || !code) {
            throw new Error("Invalid area code")
        }

        return `location in areas."district".${JSON.stringify(code)}`
    })

    return `(${conditions.join(" or ")})`
}