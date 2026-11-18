import type {
    AreaTransfer,
    CategoryTransfer,
    DepartmentTransfer,
    QuestionsTransfer,
} from "@/types/import-export/expressions"
import {
    mapAreaTransfersToDomain,
    mapCategoryTransfersToDomain,
    mapDepartmentTransfersToDomain,
    mapQuestionTransfersToDomain
} from "@/mappers/import-export.ts"
import {
    areaRepository,
    categoryRepository,
    departmentRepository,
    questionRepository
} from "@/repositories/reference-data"
import {downloadJsonFile, getExportFilename, readJsonFile} from "@/utils/expression-files.ts"
import { validateReferenceData } from "@/utils/reference-data-validation"
import type {Area, Category, Department, Question} from "@/types/domain/reference-data.ts";

// Generic import helper
async function importReferenceData<TTransfer, TDomain>(
    file: File,
    type: "categories" | "areas" | "departments" | "questions",
    mapper: (data: TTransfer[]) => TDomain[],
    save: (data: TDomain[], original: TTransfer[]) => void
): Promise<void> {
    const data = await readJsonFile<unknown>(file)

    validateReferenceData(data, type)

    const mapped = mapper(data as TTransfer[])

    // Only save after successful parsing and mapping
    save(mapped, data as TTransfer[])
}

export async function importCategories(file: File): Promise<void> {
    return importReferenceData<CategoryTransfer, Category>(
        file,
        "categories",
        mapCategoryTransfersToDomain,
        (data, original) =>
            categoryRepository.saveImported(data, original)
    )
}

export async function importAreas(file: File): Promise<void> {
    return importReferenceData<AreaTransfer, Area>(
        file,
        "areas",
        mapAreaTransfersToDomain,
        (data, original) =>
            areaRepository.saveImported(data, original)
    )
}

export async function importDepartments(file: File): Promise<void> {
    return importReferenceData<DepartmentTransfer, Department>(
        file,
        "departments",
        mapDepartmentTransfersToDomain,
        (data, original) =>
            departmentRepository.saveImported(data, original)
    )
}

export async function importQuestions(file: File): Promise<void> {
    return importReferenceData<QuestionsTransfer, Question>(
        file,
        "questions",
        mapQuestionTransfersToDomain,
        (data, original) =>
            questionRepository.saveImported(data, original)
    )
}

export function exportCategories(): void {
    downloadJsonFile(
        getExportFilename("Category"),
        categoryRepository.getOriginal()
    )
}

export function exportAreas(): void {
    downloadJsonFile(
        getExportFilename("Area"),
        areaRepository.getOriginal()
    )
}

export function exportDepartments(): void {
    downloadJsonFile(
        getExportFilename("Department"),
        departmentRepository.getOriginal()
    )
}

export function exportQuestions(): void {
    downloadJsonFile(
        getExportFilename("Question"),
        questionRepository.getOriginal()
    )
}