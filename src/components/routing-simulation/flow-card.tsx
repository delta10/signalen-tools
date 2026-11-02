import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import type {ReactNode} from "react";

type FlowCardProps = {
    title: ReactNode
    children: ReactNode
    className?: string
}
export function FlowCard({title, children, className}: FlowCardProps) {
    return(
        <div className={`${className ?? ""}`}>
            <Card className={`w-84`}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </div>
    )
}