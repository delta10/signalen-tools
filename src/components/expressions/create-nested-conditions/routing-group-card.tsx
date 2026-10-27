import {RuleGroupBodyComponents, useRuleGroup, type RuleGroupProps,} from "react-querybuilder"
import {IconDots, IconGitBranch, IconPlus, IconTrash,} from "@tabler/icons-react"
import {Card, CardContent} from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select.tsx"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu.tsx"

export function RoutingGroupCard(props: RuleGroupProps) {
    const group = useRuleGroup(props)
    const isRoot = props.path.length === 0
    const disabled = props.disabled || props.parentDisabled
    const combinator = props.ruleGroup.combinator ?? "and"

    return (
        <Card className="min-w-0 gap-4 p-4">
            <CardContent className="min-w-0 space-y-4 px-0">

                {/* Group combinator */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">
                        Voorwaarden combineren:
                    </span>
                    <Select
                        value={combinator}
                        onValueChange={group.onCombinatorChange}
                        disabled={disabled}
                    >
                        <SelectTrigger className="w-auto min-w-44">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="and">
                                Alles moet kloppen (EN)
                            </SelectItem>
                            <SelectItem value="or">
                                Eén is voldoende (OF)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {!isRoot && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="ml-auto shrink-0"
                            disabled={disabled}
                            onClick={group.removeGroup}
                            aria-label="Verwijder groep"
                        >
                            <IconTrash size={16} />
                        </Button>
                    )}
                </div>

                {/* Conditions */}
                <div className="min-w-0 space-y-3 border-l-2 border-primary/30 pl-4">
                    <RuleGroupBodyComponents {...group} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        onClick={group.addRule}
                    >
                        <IconPlus size={16} />
                        Voorwaarde toevoegen
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={disabled}
                            >
                                <IconDots size={18} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem
                                onSelect={() => group.addGroup()}
                            >
                                <IconGitBranch size={16} />
                                Groep voorwaarden toevoegen
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}