import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconCheck, IconX } from "@tabler/icons-react"
import type { RoutingExpressionTableRow } from "@/types/view-models/table"
import { routingTypeLabels } from "@/utils/routing-expressions"
import {CategoryPreview} from "@/components/expressions/category-preview.tsx";

type RoutingExpressionDetailDialogProps = {
    expression: RoutingExpressionTableRow | null
    onClose: () => void
    onEdit: (expression: RoutingExpressionTableRow) => void
    onDelete: (expression: RoutingExpressionTableRow) => void
}

export function RoutingExpressionDetailDialog({expression, onClose, onEdit, onDelete,}: RoutingExpressionDetailDialogProps) {
    if (!expression) return null

    return (
        <Dialog open={true} onOpenChange={(open) => {
            if (!open) onClose()
        }}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{expression.name}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 py-4">
                    <DetailField label="Order">
                        {expression.order}
                    </DetailField>

                    <DetailField label="Actief">
                        <div className="flex items-center gap-2">
                            {expression.isActive ? (
                                <>
                                    <IconCheck className="size-4 text-green-600" />
                                    Ja
                                </>
                            ) : (
                                <>
                                    <IconX className="size-4 text-destructive" />
                                    Nee
                                </>
                            )}
                        </div>
                    </DetailField>

                    <DetailField label="Type">
                        <div className="flex flex-wrap gap-1">
                            {expression.types.map((type) => (
                                <Badge key={type} variant={type}>
                                    {routingTypeLabels[type]}
                                </Badge>
                            ))}
                        </div>
                    </DetailField>

                    <DetailField label="Routering">
                        {expression.department || "-"}
                    </DetailField>

                    <DetailField label="Categorieën">
                        <CategoryPreview categories={expression.categories} />
                    </DetailField>

                    <DetailField label="Gebieden">
                        {expression.areas.length
                            ? expression.areas.join(", ")
                            : "-"}
                    </DetailField>

                    <div className="col-span-2">
                        <DetailField label="Aanvullende vraag/Antwoord">
                            {expression.questionAnswers.length
                                ? expression.questionAnswers.join(", ")
                                : "-"}
                        </DetailField>
                    </div>
                </div>

                <DialogFooter className="flex gap-2 sm:justify-between">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                Verwijderen
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Routing expression verwijderen?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Weet je zeker dat je "{expression.name}"
                                    wilt verwijderen? Deze actie kan niet
                                    ongedaan worden gemaakt.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Annuleren
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(expression)}
                                >
                                    Verwijderen
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Sluiten
                        </Button>
                        <Button onClick={() => onEdit(expression)}>
                            Bewerken
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DetailField({label, children}: { label: string, children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
                {label}
            </p>
            <div className="text-sm">{children}</div>
        </div>
    )
}
