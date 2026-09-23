import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import type {ReactNode} from "react";

type FlowCardProps = {
    title: string
    children: ReactNode
}
export function FlowCard({title, children}: FlowCardProps) {
    return(
        <div>
            <Card className={"bg-secondary w-84"}>
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