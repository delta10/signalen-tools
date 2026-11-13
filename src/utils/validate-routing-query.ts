import type { RuleGroupType } from "react-querybuilder"
import type { CategoryRuleValue } from "@/types/forms/create-expression"
import type { Category } from "@/types/domain/reference-data"

export type ValidationIssue = {
    path: number[]
    message: string
}

type ReferenceData = {
    categories: Category[]
}

export function validateRoutingQuery(query: RuleGroupType, data: ReferenceData,): ValidationIssue[] {
    const issues = validateGroup(query, data, [])

    if (!hasValidField(query, "category")) {
        issues.push({
            path: [],
            message: "Voeg minimaal één categorie toe.",
        })
    }

    if (!hasValidField(query, "area")) {
        issues.push({
            path: [],
            message: "Voeg minimaal één gebied toe.",
        })
    }

    return validateGroup(query, data, [])
}

function validateGroup(group: RuleGroupType, data: ReferenceData, path: number[],): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    if (group.rules.length === 0) {
        issues.push({
            path,
            message: "Voeg minimaal één voorwaarde toe.",
        })
    }

    group.rules.forEach((rule, index) => {
        const rulePath = [...path, index]

        if ("rules" in rule) {
            issues.push(
                ...validateGroup(rule as RuleGroupType, data, rulePath)
            )
            return
        }

        switch (rule.field) {
            case "category":
                issues.push(...validateCategoryRule(rule.value, data.categories, rulePath))
                break

            case "area":
                issues.push(...validateAreaRule(rule.value, rulePath))
                break
        }
    })

    return issues
}

function validateCategoryRule(value: unknown, categories: Category[], path: number[],): ValidationIssue[] {
    const categoryValue = value as CategoryRuleValue

    if (!categoryValue?.categories?.length) {
        return [{
            path,
            message: "Selecteer minimaal één categorie.",
        }]
    }

    const issues: ValidationIssue[] = []

    for (const condition of categoryValue.categories) {
        if (condition.question && !condition.answer) {
            const category = categories.find(
                (category) => String(category.id) === condition.category
            )

            issues.push({
                path,
                message: `Selecteer een antwoord bij ${category?.name ?? "de categorie"}.`,
            })
        }
    }

    return issues
}

function validateAreaRule(value: unknown, path: number[],): ValidationIssue[] {
    if (!Array.isArray(value) || value.length === 0) {
        return [{
            path,
            message: "Selecteer minimaal één gebied.",
        }]
    }

    return []
}

function hasValidField(group: RuleGroupType, field: "category" | "area",): boolean {
    return group.rules.some((rule) => {
        if ("rules" in rule) {
            return hasValidField(rule as RuleGroupType, field)
        }

        if (rule.field !== field) {
            return false
        }

        if (field === "category") {
            const value = rule.value as CategoryRuleValue
            return Array.isArray(value?.categories) &&
                value.categories.length > 0
        }

        return Array.isArray(rule.value) &&
            rule.value.length > 0
    })
}