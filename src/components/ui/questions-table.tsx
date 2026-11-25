import { useState } from "react"
import type { Category, Question } from "@/types/domain/reference-data"
import type { Expression } from "@/types/domain/routing"
import { Badge } from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import { HighlightText } from "@/components/ui/highlight-text"
import { IconCheck, IconX } from "@tabler/icons-react"
import { QuestionDetailDialog } from "@/components/questions/question-detail-dialog"
import { useNavigate } from "@tanstack/react-router"

type QuestionsTableProps = {
    questions: Question[]
    categories: Category[]
    expressions: Expression[]
    onDelete: (question: Question) => void
    globalFilter?: string
}

const questionTypeLabels: Record<string, string> = {
    radio_input: "Radio",
    checkbox_input: "Checkbox",
}

export function QuestionsTable({questions, categories, expressions, onDelete, globalFilter = ""}: QuestionsTableProps) {
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
    const navigate = useNavigate()
    const categoryNames = new Map(
        categories.map(category => [category.id, category.name])
    )

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <p className="font-medium">
                    Geen resultaten gevonden
                </p>
                <p className="text-sm text-muted-foreground">
                    Er zijn geen aanvullende vragen gevonden.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="min-w-0 overflow-x-auto">
                <Table className="bg-muted">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vraag</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Categorieën</TableHead>
                            <TableHead>Antwoorden</TableHead>
                            <TableHead>Verplicht</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questions.map(question => {
                            const questionCategories =
                                question.categoryIds.map(
                                    id => categoryNames.get(id) ?? `Categorie ${id}`
                                )

                            return (
                                <TableRow
                                    key={question.id}
                                    onClick={() =>
                                        setSelectedQuestion(question)
                                    }
                                    onKeyDown={event => {
                                        if (
                                            event.key === "Enter" ||
                                            event.key === " "
                                        ) {
                                            event.preventDefault()
                                            setSelectedQuestion(question)
                                        }
                                    }}
                                    tabIndex={0}
                                    className="cursor-pointer hover:bg-background focus-visible:outline-2 focus-visible:outline-ring"
                                >
                                    <TableCell className="max-w-80">
                                        <div className="font-medium">
                                            <HighlightText text={question.label} searchTerm={globalFilter} />
                                        </div>
                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                            {question.key}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={question.fieldType === "radio_input"
                                                    ? "radio"
                                                    : "checkbox"
                                            }
                                        >
                                            <HighlightText
                                                text={questionTypeLabels[question.fieldType] ?? question.fieldType}
                                                searchTerm={globalFilter}
                                            />
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-64">
                                        <div className="text-sm">
                                            {questionCategories.length > 0 ? (
                                                <>
                                                    <HighlightText text={questionCategories
                                                            .slice(0, 3)
                                                            .join(", ")}
                                                        searchTerm={globalFilter}
                                                    />
                                                    {questionCategories.length > 3 && (
                                                        <span className="ml-1 text-muted-foreground">
                                                            +{questionCategories.length - 3} meer
                                                        </span>
                                                    )}
                                                </>
                                                ) : ("-")
                                            }
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">
                                            {question.answers.length} opties
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {question.required ? (
                                            <IconCheck className="size-5 text-green-600" />
                                        ) : (
                                            <IconX className="size-5 text-red-600" />
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
            <QuestionDetailDialog
                question={selectedQuestion}
                categories={categories}
                expressions={expressions}
                onClose={() => setSelectedQuestion(null)}
                onEdit={question => {
                    setSelectedQuestion(null)
                    navigate({
                        to: "/questions/$questionId/edit",
                        params: {
                            questionId: String(question.id),
                        },
                    })
                }}
                onDelete={question => {
                    onDelete(question)
                    setSelectedQuestion(null)
                }}
            />
        </>
    )
}