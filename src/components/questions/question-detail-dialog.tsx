import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconCheck, IconX } from "@tabler/icons-react"
import type { ReactNode } from "react"
import type { Category, Question } from "@/types/domain/reference-data"
import type { Expression } from "@/types/domain/routing"
import { ExpandableCategoryList } from "@/components/ui/category-list"
import { QuestionDependencyWarning } from "@/components/questions/question-dependency-warning"
import { getExpressionsUsingQuestion } from "@/utils/questions"
import {getQuestionsDependingOnQuestion} from "@/utils/question-dependencies.ts";
import {DependentQuestionsWarning} from "@/components/questions/dependent-question-warning.tsx";

type QuestionDetailDialogProps = {
    question: Question | null
    categories: Category[]
    expressions: Expression[]
    onClose: () => void
    onEdit: (question: Question) => void
    onDelete: (question: Question) => void
    questions: Question[]
}

export function QuestionDetailDialog({question, categories, expressions, onClose, onEdit, onDelete, questions}: QuestionDetailDialogProps) {
    if (!question) return null

    const categoryNames = new Map(
        categories.map(category => [category.id, category.name])
    )

    const questionCategories = question.categoryIds.map(
        id => categoryNames.get(id) ?? `Categorie ${id}`
    )

    const dependentExpressions = getExpressionsUsingQuestion(question.key, expressions)
    const dependentQuestions = getQuestionsDependingOnQuestion(question.key, questions)

    return (
        <Dialog
            open={true}
            onOpenChange={open => {
                if (!open) onClose()
            }}
        >
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{question.label}</DialogTitle>
                </DialogHeader>

                <div className="grid max-h-[65vh] grid-cols-2 gap-6 overflow-y-auto py-4">
                    <DetailField label="Key">
                        <code className="break-all">
                            {question.key}
                        </code>
                    </DetailField>

                    <DetailField label="Verplicht">
                        <div className="flex items-center gap-2">
                            {question.required ? (
                                <>
                                    <IconCheck className="size-4 text-green-600" />
                                    Ja
                                </>
                            ) : (
                                <>
                                    <IconX className="size-4 text-destructive" />
                                    Nee
                                </>
                            )}
                        </div>
                    </DetailField>
                    <DetailField label="Type">
                        <Badge variant={
                                   question.fieldType === "radio_input"
                                    ? "radio"
                                    : "checkbox"
                            }
                        >
                            {question.fieldType === "radio_input"
                                ? "Radio"
                                : "Checkbox"}
                        </Badge>
                    </DetailField>

                    <DetailField label="Categorieën">
                        {questionCategories.length > 0
                            ? (<ExpandableCategoryList categories={questionCategories} searchTerm=""/>)
                            : ("-")
                        }
                    </DetailField>
                    <div className="col-span-2">
                        <DetailField label="Antwoordopties">
                            <div className="flex flex-col gap-2">
                                {question.answers.map(answer => (
                                    <div key={answer.value} className="flex items-center gap-3">
                                        <Badge variant="outline">
                                            {answer.value}
                                        </Badge>
                                        <span>{answer.label}</span>
                                    </div>
                                ))}
                            </div>
                        </DetailField>
                    </div>
                    <div className="col-span-2">
                        <DetailField label="Vraagafhankelijkheden">
                            {question.dependencies === undefined ? (
                                <p className="text-muted-foreground">
                                    Niet beschikbaar voor weergave.
                                </p>
                            ) : question.dependencies.length === 0 ? (
                                <p className="text-muted-foreground">
                                    Geen afhankelijkheden ingesteld.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {question.dependencies.map((dependency, index) => {
                                        const sourceQuestion = questions.find(
                                            item => item.key === dependency.questionKey
                                        )

                                        return (
                                            <div key={dependency.questionKey} className="flex flex-col gap-2">
                                                {index > 0 && (
                                                    <span className="text-center text-xs text-muted-foreground">
                                                        OF
                                                    </span>
                                                )}
                                                <div className="flex flex-col gap-2 rounded-md border p-3">
                                                    <p className="font-medium">
                                                        {sourceQuestion?.label ?? dependency.questionKey}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {dependency.answerValues.map(value => (
                                                            <Badge key={value} variant="outline">
                                                                {sourceQuestion?.answers.find(
                                                                    answer => answer.value === value
                                                                )?.label ?? value}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </DetailField>
                    </div>
                </div>
                <DialogFooter className="flex gap-2 sm:justify-between">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                Verwijderen
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Aanvullende vraag verwijderen?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Weet je zeker dat je "{question.label}"
                                    wilt verwijderen? Deze actie kan niet
                                    ongedaan worden gemaakt.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <QuestionDependencyWarning
                                expressions={dependentExpressions}
                                title={`Deze vraag wordt gebruikt in ${
                                    dependentExpressions.length
                                } ${
                                    dependentExpressions.length === 1
                                        ? "routing expression"
                                        : "routing expressions"
                                }.`}
                                description="Het verwijderen van deze vraag kan ervoor zorgen dat onderstaande routeringen niet meer correct werken."
                            />
                            <DependentQuestionsWarning
                                questions={dependentQuestions}
                                title="Andere vragen zijn afhankelijk van deze vraag."
                                description="Het verwijderen van deze vraag kan gevolgen hebben voor de zichtbaarheid van onderstaande vragen."
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Annuleren
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(question)}>
                                    {dependentExpressions.length > 0 ||
                                    dependentQuestions.length > 0
                                        ? "Toch verwijderen"
                                        : "Verwijderen"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Sluiten
                        </Button>
                        <Button onClick={() => onEdit(question)}>
                            Bewerken
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DetailField({label, children}: { label: string, children: ReactNode }) {
    return (
        <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
                {label}
            </p>
            <div className="text-sm">
                {children}
            </div>
        </div>
    )
}