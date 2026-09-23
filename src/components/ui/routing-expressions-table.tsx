import {Table} from "@/components/ui/table.tsx"
import {TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import type {RoutingExpressionTableRow} from "@/types/routing-expressions.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {routingTypeLabels} from "@/utils/routing-expressions.ts";
import {ExpandableCategoryList} from "@/components/ui/category-list.tsx";
import {IconCheck, IconX} from "@tabler/icons-react";
import {type ColumnDef, columnFilteringFeature} from "@tanstack/react-table"
import {tableFeatures, useTable, createFilteredRowModel, filterFn_includesString, globalFilteringFeature,} from "@tanstack/react-table"
import {HighlightText} from "@/components/ui/highlight-text.tsx";

type RoutingExpressionsTableProps = {
    tableData: RoutingExpressionTableRow[],
    globalFilter: string,
    onGlobalFilterChange: (value: string) => void
}

function getColumns(globalFilter: string): ColumnDef<typeof features, RoutingExpressionTableRow>[] {
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

const features = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns: {
        includesString: filterFn_includesString
    }
})

export function RoutingExpressionsTable({ tableData, globalFilter, onGlobalFilterChange }: RoutingExpressionsTableProps ) {
    const columns = getColumns(globalFilter)
    const table = useTable({features, data: tableData, columns, globalFilterFn: "includesString", state: {globalFilter}, onGlobalFilterChange})
    const filteredRows = table.getRowModel().rows

    if(globalFilter && filteredRows.length === 0) {
        return(
            <div className="flex flex-col items-center justify-center gap-2 text-center">
                <p className="font-medium">
                    Geen resultaten gevonden
                </p>
                <p className="text-sm text-muted-foreground">
                    Er zijn geen routing expressions die overeenkomen met "{globalFilter}".
                </p>
            </div>
        )
    }

    return(
        <>
            <Table className={"bg-muted"}>
                <TableCaption>Routing Expressions</TableCaption>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    <table.FlexRender header={header} />
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getAllCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    <table.FlexRender cell={cell} />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
