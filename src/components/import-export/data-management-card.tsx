import type { ReactNode } from "react"
import {IconCircleCheck, IconAlertCircle, IconCircleDashed,} from "@tabler/icons-react"

type Props = {
    title: string
    count: number
    imported: boolean
    optional?: boolean
    children: ReactNode
}

export function DataManagementCard({title, count, imported, optional = false, children,}: Props) {
    const status = imported
        ? {
            label: "Geïmporteerd",
            icon: IconCircleCheck,
            color: "text-green-600",
        }
        : optional
            ? {
                label: "Optioneel",
                icon: IconCircleDashed,
                color: "text-muted-foreground",
            }
            : {
                label: "Import vereist",
                icon: IconAlertCircle,
                color: "text-amber-600",
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
                            : optional
                                ? `${count} routeringsregels beschikbaar`
                                : "Nog niet geïmporteerd"}
                    </p>
                </div>

                <StatusIcon className={`size-5 ${status.color}`} />
            </div>

            <p className={`text-sm font-medium ${status.color}`}>
                {status.label}
            </p>

            <div className="mt-auto">
                {children}
            </div>
        </div>
    )
}