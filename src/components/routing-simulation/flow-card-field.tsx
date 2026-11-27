import type { ReactNode } from "react"

type FlowCardFieldProps = {
    label: string
    value?: string | number | null
    icon?: ReactNode
}

export function FlowCardField({label, value, icon,}: FlowCardFieldProps) {
    return (
        <div className="flex items-start gap-3">
            {icon && (
                <span className="mt-0.5 shrink-0 text-muted-foreground">
                    {icon}
                </span>
            )}

            <div className="min-w-0 space-y-0.5">
                <p className="text-xs text-muted-foreground">
                    {label}
                </p>

                <p className="wrap-break-word text-sm font-medium">
                    {value || "Niet ingevuld"}
                </p>
            </div>
        </div>
    )
}