import {Table} from "@/components/ui/table.tsx"
import {TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import type {RoutingExpressionTableRow} from "@/types/routing-expressions.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {routingTypeLabels} from "@/utils/routing-expressions.ts";
import {ExpandableCategoryList} from "@/components/ui/category-list.tsx";
import {IconCheck, IconX} from "@tabler/icons-react";
import {type ColumnDef, columnFilteringFeature} from "@tanstack/react-table"
import {tableFeatures, useTable, createFilteredRowModel, filterFn_includesString, globalFilteringFeature,} from "@tanstack/react-table"

type RoutingExpressionsTableProps = {
    tableData: RoutingExpressionTableRow[],
    globalFilter: string,
    onGlobalFilterChange: (value: string) => void
}

const columns: ColumnDef<typeof features, RoutingExpressionTableRow>[] = [
    {
        accessorKey: "order",
        header: "Order",
    },
    {
        accessorKey: "name",
        header: "Naam",
    },
    {
        accessorKey: "types",
        header: "Type",
        cell: ({ row }) => (
            <>
                {row.original.types.map((type) => (
                    <Badge
                        key={type}
                        variant={type}
                        className="my-2"
                    >
                        {routingTypeLabels[type]}
                    </Badge>
                ))}
            </>
        )
    },
    {
        accessorKey: "categories",
        header: "Categorie",
        cell: ({row})  => (
            <ExpandableCategoryList categories={row.original.categories}/>
        )
    },
    {
        accessorKey: "areas",
        header: "Gebied",
        cell: ({row}) => (
            row.original.areas.join(", ") || "-"
        )
    },
    {
        accessorKey: "questionAnswers",
        header: "Aanvullende vraag/Antwoord",
        cell: ({row}) => (
            <>
                {row.original.questionAnswers.length > 0
                    ? row.original.questionAnswers.map(
                        (questionAnswer) => (
                            <div key={questionAnswer}>
                                {questionAnswer}
                            </div>
                        )
                    )
                    : "-"}
            </>

        )
    },
    {
        accessorKey: "department",
        header: "Routering",
    },
    {
        accessorKey: "isActive",
        header: "Actief",
        cell: ({row}) => (
            <>
                {row.original.isActive
                        ? (<IconCheck className="text-green-600" />)
                        : (<IconX className="text-red-600" />)}
            </>
        )
    },
]

const features = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns: {
        includesString: filterFn_includesString
    }
})
export function RoutingExpressionsTable({ tableData, globalFilter, onGlobalFilterChange }: RoutingExpressionsTableProps ) {
    const table = useTable({features, data: tableData, columns, globalFilterFn: "includesString", state: {globalFilter}, onGlobalFilterChange})
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
