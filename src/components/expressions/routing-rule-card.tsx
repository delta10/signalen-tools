import { Rule, type RuleProps } from "react-querybuilder"
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"

export function RoutingRuleCard(props: RuleProps) {
    return (
        <Card className="min-w-0 gap-3 py-4">
            <CardHeader className="px-4">
                <CardTitle className="text-sm">
                    Voorwaarde
                </CardTitle>
            </CardHeader>

            <CardContent className="min-w-0 px-4">
                <Rule {...props} />
            </CardContent>
        </Card>
    )
}