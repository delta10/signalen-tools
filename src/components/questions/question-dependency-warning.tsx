import type { Expression } from "@/types/domain/routing"
import { IconAlertTriangle } from "@tabler/icons-react"

type QuestionDependencyWarningProps = {
    expressions: Expression[]
    title: string
    description: string
}

export function QuestionDependencyWarning({expressions, title, description,}: QuestionDependencyWarningProps) {
    if (expressions.length === 0) {
        return null
    }

    return (
        <div
            role="alert"
            className="flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-4"
        >
            <IconAlertTriangle className="size-5 shrink-0 text-amber-600" />

            <div className="flex min-w-0 flex-col gap-2">
                <p className="text-sm font-medium">
                    {title}
                </p>

                <p className="text-sm text-muted-foreground">
                    {description}
                </p>

                <ul className="max-h-40 list-disc space-y-1
                               overflow-y-auto pl-5 text-sm">
                    {expressions.map(expression => (
                        <li key={expression.id}>
                            {expression.name}

                            {!expression.isActive && (
                                <span className="text-muted-foreground">
                                    {" "}(inactief)
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}