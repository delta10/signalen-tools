import { Rule, type RuleProps } from "react-querybuilder"
import { IconMapPin, IconTag } from "@tabler/icons-react"
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"

export function RoutingRuleCard(props: RuleProps) {
    const isCategory = props.rule.field === "category"

    return (
        <Card className="relative min-w-0 gap-4 py-4">
            <CardHeader className="px-4 pr-14">
                <CardTitle className="flex items-center gap-2 text-sm">
                    {isCategory ? (
                        <IconTag size={18} />
                    ) : (
                        <IconMapPin size={18} />
                    )}

                    {isCategory ? "Categorie" : "Gebied"}
                </CardTitle>
            </CardHeader>

            <CardContent
                className="px-4 [&_.rule]:flex [&_.rule]:min-w-0 [&_.rule]:flex-col [&_.rule]:items-stretch [&_.rule]:gap-4"
            >
                <Rule {...props} />
            </CardContent>
        </Card>
    )
}