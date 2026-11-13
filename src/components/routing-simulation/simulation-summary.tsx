import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SimulationResult } from "@/types/routing-simulations"
import {IoIosCheckmarkCircleOutline} from "react-icons/io";
import {RxCross1} from "react-icons/rx";

type SimulationSummaryProps = {
    results: SimulationResult[]
    selectedRoutingExpression: SimulationResult | null
}

export function SimulationSummary({results, selectedRoutingExpression,}: SimulationSummaryProps) {
    const totalCount = results.length
    const matchedCount = results.filter(result => result.matches).length
    const unmatchedCount = totalCount - matchedCount

    const selectedExpression = selectedRoutingExpression?.expression
    const department = selectedExpression?.routing?.department

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>Simulatieresultaat</CardTitle>

                <Badge
                    variant={selectedExpression ? "success" : "destructive"}
                    className="gap-1"
                >
                    {selectedExpression ? (
                        <>
                            <IoIosCheckmarkCircleOutline />
                            Bestemming gevonden
                        </>
                    ) : (
                        <>
                            <RxCross1 />
                            Geen bestemming gevonden
                        </>
                    )}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="rounded-lg bg-muted/50 p-2">
                    <p className="mb-1 text-sm text-muted-foreground">
                        Gekozen bestemming
                    </p>

                    {selectedExpression ? (
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">
                                {department?.name ?? "Afdeling onbekend"}
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Routeerregel: {selectedExpression.name}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                Order: {selectedRoutingExpression?.order}
                            </p>
                        </div>
                    ) : (
                        <p className="font-medium">
                            Geen passende routeerregel gevonden
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <Statistic
                        value={totalCount}
                        label="Gecontroleerd"
                    />

                    <Statistic
                        value={matchedCount}
                        label="Matches"
                    />

                    <Statistic
                        value={unmatchedCount}
                        label="Geen match"
                    />
                </div>
            </CardContent>
        </Card>
    )
}

type StatisticProps = {
    value: number
    label: string
}

function Statistic({ value, label }: StatisticProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border p-2">
            <span className="text-2xl font-semibold tabular-nums">
                {value}
            </span>

            <span className="text-center text-xs text-muted-foreground">
                {label}
            </span>
        </div>
    )
}
