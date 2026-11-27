import type { QuestionDependency } from "@/types/domain/reference-data"

export function mapQuestionDependenciesToDomain(ifOneOf: unknown): QuestionDependency[] | undefined {
    if (
        typeof ifOneOf !== "object" ||
        ifOneOf === null ||
        Array.isArray(ifOneOf)
    ) {
        return undefined
    }

    const dependencies: QuestionDependency[] = []
    for (const [questionKey, value] of Object.entries(ifOneOf)) {
        if (typeof value === "string") {
            dependencies.push({
                questionKey,
                answerValues: [value],
            })
        } else if (
            Array.isArray(value) &&
            value.every(item => typeof item === "string")
        ) {
            dependencies.push({
                questionKey,
                answerValues: value,
            })
        } else {
            return undefined
        }
    }

    return dependencies
}

export function mapQuestionDependenciesToTransfer(dependencies: QuestionDependency[]): Record<string, string | string[]> {
    return Object.fromEntries(
        dependencies.map(dependency => [
            dependency.questionKey,
            dependency.answerValues.length === 1
                ? dependency.answerValues[0]
                : dependency.answerValues,
        ])
    )
}

export function areQuestionDependenciesEqual(first: QuestionDependency[], second: QuestionDependency[]): boolean {
    if (first.length !== second.length) {
        return false
    }

    return first.every(dependency => {
        const matching = second.find(
            item => item.questionKey === dependency.questionKey
        )

        if (!matching) return false

        return (
            dependency.answerValues.length === matching.answerValues.length &&
            dependency.answerValues.every(
                value => matching.answerValues.includes(value)
            )
        )
    })
}