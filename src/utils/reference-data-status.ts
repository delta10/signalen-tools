import {
    categoryRepository,
    areaRepository,
    departmentRepository,
    questionRepository,
} from "@/repositories/reference-data"

export function getReferenceDataStatus() {
    const categories = categoryRepository.hasData()
    const areas = areaRepository.hasData()
    const departments = departmentRepository.hasData()
    const questions = questionRepository.hasData()

    return {
        categories,
        areas,
        departments,
        questions,
        isReady: categories && areas && departments && questions,
    }
}