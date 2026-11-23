import type {
    AreaTransfer,
    CategoryTransfer,
    DepartmentTransfer,
    QuestionsTransfer,
} from "@/types/import-export/expressions"
import {
    mapAreaTransfersToDomain,
    mapCategoryTransfersToDomain,
    mapDepartmentTransfersToDomain, mapQuestionDomainToTransfers,
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
    const data = await readJsonFile<unknown>(file)
    validateReferenceData(data, "categories")

    const original = data as CategoryTransfer[]
    const mapped = mapCategoryTransfersToDomain(original)

    if (questionRepository.hasData()) {
        const existingCategories = categoryRepository.getAll()

        const changed = existingCategories.some(existing => {
            const replacement = mapped.find(
                category => category.id === existing.id
            )

            return replacement?.slug !== existing.slug
        })

        if (changed) {
            throw new Error(
                "De categorie-import verandert bestaande categorie-IDs. " +
                "Dit kan de koppelingen met vragen beschadigen. " +
                "Import is daarom geblokkeerd."
            )
        }
    }

    categoryRepository.saveImported(mapped, original)
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
    const categories = categoryRepository.getAll()

    if (!categoryRepository.hasData()) {
        throw new Error(
            "Importeer eerst de categorieën voordat je vragen importeert."
        )
    }

    return importReferenceData<QuestionsTransfer, Question>(
        file,
        "questions",
        data => mapQuestionTransfersToDomain(
            data,
            categories
        ),
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
    const questions = questionRepository.getAll()
    const categories = categoryRepository.getAll()
    const originalQuestions = questionRepository.getOriginal()

    const transfers = mapQuestionDomainToTransfers(
        questions,
        categories,
        originalQuestions
    )

    downloadJsonFile(
        getExportFilename("Question"),
        transfers
    )
}