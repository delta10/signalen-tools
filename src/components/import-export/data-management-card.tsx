import type { ReactNode } from "react"
import {
    IconCircleCheck,
    IconAlertCircle,
    IconCircleDashed,
    IconExternalLink,
    IconInfoCircle,
} from "@tabler/icons-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type Props = {
    title: string
    count: number
    imported: boolean
    optional?: boolean
    children: ReactNode
    files: {
        name: string
        djangoUrl?: string
    }[]
    recommended?: boolean
}

export function DataManagementCard({title, count, imported, optional = false, children, files, recommended = false}: Props) {
    const status = imported
        ? {
            label: "Geïmporteerd",
            icon: IconCircleCheck,
            color: "text-green-600",
            description: "Deze gegevens zijn geïmporteerd en beschikbaar voor gebruik.",
        }
        : recommended
            ? {
                label: "Aanbevolen",
                icon: IconInfoCircle,
                color: "text-blue-600",
                description: "Importeer deze gegevens voor volledige ondersteuning van aanvullende vraagvoorwaarden en simulaties.",
            }
            : optional
                ? {
                    label: "Optioneel",
                    icon: IconCircleDashed,
                    color: "text-muted-foreground",
                    description: "Deze gegevens zijn niet vereist om te beginnen.",
                }
                : {
                    label: "Import vereist",
                    icon: IconAlertCircle,
                    color: "text-amber-600",
                    description: "Importeer deze gegevens voordat je kunt beginnen.",
                }

    const StatusIcon = status.icon

    return (
        <div className="flex h-full flex-col gap-4 rounded-lg border p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-medium">{title}</h3>
                    <p className="text-sm text-muted-foreground">
                        {imported
                            ? `${count} records beschikbaar`
                            : "Nog niet geïmporteerd"}
                    </p>
                </div>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <StatusIcon
                                className={`size-5 cursor-help ${status.color}`}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{status.description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <p className={`text-sm font-medium ${status.color}`}>
                {status.label}
            </p>
            <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                    Benodigde bestanden:
                </p>

                {files.map((file) => (
                    <div key={file.name}>
                        {file.djangoUrl ? (
                            <a
                                href={file.djangoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-medium underline"
                            >
                                {file.name}
                                <IconExternalLink className="size-4" />
                            </a>
                        ) : (
                            <span>{file.name}</span>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-auto">
                {children}
            </div>
        </div>
    )
}