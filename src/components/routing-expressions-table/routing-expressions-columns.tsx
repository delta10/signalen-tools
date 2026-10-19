import {HighlightText} from "@/components/ui/highlight-text.tsx";
import {routingTypeLabels} from "@/utils/routing-expressions.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {ExpandableCategoryList} from "@/components/ui/category-list.tsx";
import {IconCheck, IconX} from "@tabler/icons-react";
import type {ColumnDef} from "@tanstack/react-table";
import type {features} from "@/components/routing-expressions-table/table-config.tsx";
import type {RoutingExpressionTableRow} from "@/types/routing-expressions.ts";

export function getColumns(globalFilter: string): ColumnDef<typeof features, RoutingExpressionTableRow>[] {
    return [
        {
            accessorKey: "order",
            header: "Order",
        },
        {
            accessorKey: "name",
            header: "Naam",
            cell: ({ row }) => (
                <HighlightText
                    text={row.original.name}
                    searchTerm={globalFilter}
                />
            ),
        },
        {
            id: "types",
            header: "Type",
            accessorFn: (row) =>
                row.types
                    .map((type) => routingTypeLabels[type])
                    .join(" "),
            cell: ({ row }) => (
                <>
                    {row.original.types.map((type) => (
                        <Badge key={type} variant={type} className="my-2">
                            <HighlightText
                                text={routingTypeLabels[type]}
                                searchTerm={globalFilter}
                            />
                        </Badge>
                    ))}
                </>
            ),
        },
        {
            id: "categories",
            header: "Categorie",
            accessorFn: (row) => row.categories.join(" "),
            cell: ({ row }) => (
                <ExpandableCategoryList categories={row.original.categories} searchTerm={globalFilter}/>
            ),
        },
        {
            id: "areas",
            header: "Gebied",
            accessorFn: (row) => row.areas.join(" "),
            cell: ({ row }) => (
                <>
                    {row.original.areas.length > 0
                        ? row.original.areas.map((area) => (
                            <div key={area}>
                                <HighlightText
                                    text={area}
                                    searchTerm={globalFilter}
                                />
                            </div>
                        ))
                        : "-"
                    }
                </>
            ),
        },
        {
            id: "questionAnswers",
            header: "Aanvullende vraag/Antwoord",
            accessorFn: (row) => row.questionAnswers.join(" "),
            cell: ({ row }) => (
                <>
                    {row.original.questionAnswers.length > 0
                        ? row.original.questionAnswers.map((questionAnswer) => (
                            <div key={questionAnswer}>
                                <HighlightText
                                    text={questionAnswer}
                                    searchTerm={globalFilter}
                                />
                            </div>
                        ))
                        : "-"
                    }
                </>
            ),
        },
        {
            accessorKey: "department",
            header: "Routering",
            cell: ({ row }) => (
                <HighlightText
                    text={row.original.department}
                    searchTerm={globalFilter}
                />
            ),
        },
        {
            accessorKey: "isActive",
            header: "Actief",
            cell: ({ row }) => (
                <>
                    {row.original.isActive
                        ? <IconCheck className="text-green-600" />
                        : <IconX className="text-red-600" />
                    }
                </>
            ),
        },
    ]
}