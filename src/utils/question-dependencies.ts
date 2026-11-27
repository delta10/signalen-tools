import type {Question, QuestionDependency,} from "@/types/domain/reference-data"
import { isSupportedQuestion } from "@/utils/questions"

export function validateQuestionDependencies(
    currentQuestionKey: string,
    dependencies: QuestionDependency[],
    questions: Question[],
    originalQuestionKey?: string
): string | null {
    const usedKeys = new Set<string>()

    for (const dependency of dependencies) {
        if (!dependency.questionKey) {
            return "Selecteer bij iedere voorwaarde een vraag."
        }

        if (
            dependency.questionKey === currentQuestionKey ||
            dependency.questionKey === originalQuestionKey
        ) {
            return "Een vraag kan niet afhankelijk zijn van zichzelf."
        }

        if (usedKeys.has(dependency.questionKey)) {
            return "Een vraag mag slechts één keer als afhankelijkheid voorkomen."
        }

        usedKeys.add(dependency.questionKey)

        const sourceQuestion = questions.find(
            question => question.key === dependency.questionKey
        )

        if (!sourceQuestion) {
            return `Vraag "${dependency.questionKey}" bestaat niet.`
        }

        if (!isSupportedQuestion(sourceQuestion)) {
            return `Vraag "${dependency.questionKey}" heeft een niet-ondersteund vraagtype.`
        }

        if (dependency.answerValues.length === 0) {
            return `Selecteer minimaal één antwoord bij "${sourceQuestion.label}".`
        }

        const hasInvalidAnswers = dependency.answerValues.some(
            value => !sourceQuestion.answers.some(
                answer => answer.value === value
            )
        )

        if (hasInvalidAnswers) {
            return `Een geselecteerd antwoord bij "${sourceQuestion.label}" bestaat niet meer.`
        }
    }

    return null
}

export function hasCircularQuestionDependency(
    currentQuestionKey: string,
    dependencies: QuestionDependency[],
    questions: Question[],
    originalQuestionKey?: string
): boolean {
    const questionsByKey = new Map(
        questions.map(question => [question.key, question])
    )

    function reachesCurrentQuestion(key: string, visited: Set<string>): boolean {
        if (
            key === currentQuestionKey ||
            key === originalQuestionKey
        ) {
            return true
        }

        if (visited.has(key)) {
            return false
        }

        visited.add(key)

        const question = questionsByKey.get(key)
        return (question?.dependencies ?? []).some(
            dependency =>
                reachesCurrentQuestion(
                    dependency.questionKey,
                    visited
                )
        )
    }

    return dependencies.some(dependency =>
        reachesCurrentQuestion(
            dependency.questionKey,
            new Set<string>()
        )
    )
}

export function getQuestionsDependingOnQuestion(questionKey: string, questions: Question[], answerValue?: string): Question[] {
    return questions.filter(question =>
        question.dependencies?.some(dependency =>
            dependency.questionKey === questionKey &&
            (
                answerValue === undefined ||
                dependency.answerValues.includes(answerValue)
            )
        )
    )
}