import type { Question } from "@/types/domain/reference-data"
import { IconAlertTriangle } from "@tabler/icons-react"

type DependentQuestionsWarningProps = {
    questions: Question[]
    title: string
    description: string
}

export function DependentQuestionsWarning({questions, title, description,}: DependentQuestionsWarningProps) {
    if (questions.length === 0) return null

    return (
        <div className="flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-4">
            <IconAlertTriangle className="size-5 shrink-0 text-amber-600" />
            <div className="flex min-w-0 flex-col gap-2">
                <p className="text-sm font-medium">
                    {title}
                </p>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
                <ul className="max-h-40 list-disc space-y-1 overflow-y-auto pl-5 text-sm">
                    {questions.map(question => (
                        <li key={question.id}>
                            {question.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}