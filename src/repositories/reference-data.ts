import type {Area, Category, Department, Question,} from "@/types/domain/reference-data"
import type {AreaTransfer, CategoryTransfer, DepartmentTransfer, QuestionsTransfer,} from "@/types/import-export/expressions"

type StoredReferenceData<TDomain, TTransfer> = {
    data: TDomain[]
    original: TTransfer[]
}

function createReferenceRepository<TDomain, TTransfer>(type: string) {
    const storageKey = `reference-data-${type}`

    function getStored(): StoredReferenceData<TDomain, TTransfer> | null {
        const stored = localStorage.getItem(storageKey)

        return stored
            ? JSON.parse(stored) as StoredReferenceData<TDomain, TTransfer>
            : null
    }

    return {
        getAll(): TDomain[] {
            return getStored()?.data ?? []
        },

        getOriginal(): TTransfer[] {
            return getStored()?.original ?? []
        },

        saveImported(
            data: TDomain[],
            original: TTransfer[]
        ): void {
            localStorage.setItem(
                storageKey,
                JSON.stringify({ data, original })
            )
        },

        hasData(): boolean {
            return localStorage.getItem(storageKey) !== null
        },

        clear(): void {
            localStorage.removeItem(storageKey)
        },
    }
}

export const categoryRepository =
    createReferenceRepository<Category, CategoryTransfer>("categories")

export const areaRepository =
    createReferenceRepository<Area, AreaTransfer>("areas")

export const departmentRepository =
    createReferenceRepository<Department, DepartmentTransfer>("departments")

export const questionRepository =
    createReferenceRepository<Question, QuestionsTransfer>("questions")