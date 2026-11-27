export type Category = {
    id: number
    slug: string
    name: string
}

export type Department = {
    id: number
    code: string
    name: string
    isIntern: boolean
}

export type Area = {
    id: number
    code: string
    name: string
    type: AreaType
}

export type AreaType = {
    id: number
    code: string
    name: string
}

export type Question = {
    id: number
    key: string
    label: string
    fieldType: string
    required: boolean
    answers: QuestionAnswer[]
    categoryIds: number[]
    nextAnswerValue?: number
    dependencies?: QuestionDependency[]
}

export type QuestionAnswer = {
    value: string
    label: string
}

export type QuestionDependency = {
    questionKey: string
    answerValues: string[]
}

export type User = {
    email: string
    isActive: boolean
    departments: string[]
}