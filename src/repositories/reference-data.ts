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

        saveAll(data: TDomain[]): void {
            const stored = getStored()

            localStorage.setItem(
                storageKey,
                JSON.stringify({
                    data,
                    original: stored?.original ?? [],
                })
            )
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


const baseQuestionRepository =
    createReferenceRepository<Question, QuestionsTransfer>("questions")

export const questionRepository = {
    ...baseQuestionRepository,

    getById(id: number): Question | undefined {
        return this.getAll().find(
            (question) => question.id === id
        )
    },

    add(question: Question): void {
        const questions = this.getAll()

        if (questions.some(q => q.id === question.id)) {
            throw new Error("Er bestaat al een vraag met dit ID.")
        }

        if (questions.some(q => q.key === question.key)) {
            throw new Error(`Er bestaat al een aanvullende vraag met de key "${question.key}".`)
        }

        this.saveAll([...questions, question])
    },

    update(question: Question): void {
        const questions = this.getAll()

        if (!questions.some(q => q.id === question.id)) {
            throw new Error("De aanvullende vraag kon niet worden gevonden.")
        }

        if (questions.some(
            q => q.key === question.key && q.id !== question.id
        )) {
            throw new Error(`Er bestaat al een aanvullende vraag met de key "${question.key}".`)
        }

        this.saveAll(
            questions.map(q =>
                q.id === question.id ? question : q
            )
        )
    },

    remove(id: number): void {
        this.saveAll(
            this.getAll().filter(q => q.id !== id)
        )
    },
}
