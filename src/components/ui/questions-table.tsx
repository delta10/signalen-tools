import { Fragment, useState } from "react"
import type { Category, Question } from "@/types/domain/reference-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { ExpandableCategoryList } from "@/components/ui/category-list"
import { HighlightText } from "@/components/ui/highlight-text"
import {IconCheck, IconChevronDown, IconChevronRight, IconDots, IconEye, IconPencil, IconTrash, IconX,} from "@tabler/icons-react"

type QuestionsTableProps = {
    questions: Question[]
    categories: Category[]
    onEdit: (question: Question) => void
    onDelete: (question: Question) => void
    globalFilter?: string
}

const questionTypeLabels: Record<string, string> = {
    radio_input: "Radio",
    checkbox_input: "Checkbox",
}

export function QuestionsTable({questions, categories, onEdit, onDelete, globalFilter = "",}: QuestionsTableProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null)

    const categoryNames = new Map(
        categories.map(category => [category.id, category.name])
    )

    function toggleExpanded(id: number) {
        setExpandedId(current => current === id ? null : id)
    }

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <p className="font-medium">Geen resultaten gevonden</p>
                <p className="text-sm text-muted-foreground">
                    Er zijn geen aanvullende vragen gevonden.
                </p>
            </div>
        )
    }

    return (
        <div className="min-w-0 overflow-x-auto">
            <Table className="bg-muted">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10" />
                        <TableHead>Vraag</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Categorieën</TableHead>
                        <TableHead>Antwoorden</TableHead>
                        <TableHead>Verplicht</TableHead>
                        <TableHead className="w-14" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {questions.map(question => {
                        const expanded = expandedId === question.id

                        const questionCategories = question.categoryIds.map(
                            id => categoryNames.get(id) ?? `Categorie ${id}`
                        )

                        return (
                            <Fragment key={question.id}>
                                <TableRow
                                    className={
                                        expanded
                                            ? "bg-accent/40"
                                            : "hover:bg-accent/30"
                                    }
                                >
                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={() =>
                                                toggleExpanded(question.id)
                                            }
                                        >
                                            {expanded
                                                ? <IconChevronDown className="size-4" />
                                                : <IconChevronRight className="size-4" />
                                            }
                                        </Button>
                                    </TableCell>

                                    <TableCell className="max-w-80">
                                        <button
                                            type="button"
                                            className="text-left font-medium hover:underline"
                                            onClick={() =>
                                                toggleExpanded(question.id)
                                            }
                                        >
                                            <HighlightText
                                                text={question.label}
                                                searchTerm={globalFilter}
                                            />
                                        </button>

                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                            {question.key}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant={question.fieldType === "radio_input" ? "radio" : "checkbox"}>
                                            {questionTypeLabels[question.fieldType]
                                                ?? question.fieldType}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <div className="max-w-64">
                                            {questionCategories.length > 0 ? (
                                                <ExpandableCategoryList
                                                    categories={questionCategories}
                                                    searchTerm={globalFilter}
                                                />
                                            ) : (
                                                "-"
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className="text-sm">
                                            {question.answers.length} opties
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        {question.required ? (
                                            <IconCheck
                                                className="size-5 text-green-600"
                                                aria-label="Verplicht"
                                            />
                                        ) : (
                                            <IconX
                                                className="size-5 text-red-600"
                                                aria-label="Niet verplicht"
                                            />
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Acties voor ${question.label}`}
                                                >
                                                    <IconDots className="size-5" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onSelect={() =>
                                                        toggleExpanded(question.id)
                                                    }
                                                >
                                                    <IconEye />
                                                    {expanded
                                                        ? "Details sluiten"
                                                        : "Bekijken"}
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onSelect={() =>
                                                        onEdit(question)
                                                    }
                                                >
                                                    <IconPencil />
                                                    Bewerken
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onSelect={() =>
                                                        onDelete(question)
                                                    }
                                                >
                                                    <IconTrash />
                                                    Verwijderen
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>

                                {expanded && (
                                    <TableRow className="bg-accent/20 hover:bg-accent/20">
                                        <TableCell colSpan={7} className="p-0">
                                            <div className="space-y-4 border-l-2 border-primary px-6 py-5">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        Key
                                                    </p>
                                                    <code className="break-all text-sm">
                                                        {question.key}
                                                    </code>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        Antwoordopties
                                                    </p>

                                                    <div className="flex flex-col gap-2">
                                                        {question.answers.map(answer => (
                                                            <div
                                                                key={answer.value}
                                                                className="flex items-center gap-3 text-sm"
                                                            >
                                                                <Badge variant="outline">
                                                                    {answer.value}
                                                                </Badge>
                                                                <span>
                                                                    {answer.label}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
