import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import type {RoutingExpressionsTableInstance} from "@/components/routing-expressions-table/table-config"

type RoutingExpressionsTableProps = {
    table: RoutingExpressionsTableInstance
}

export function RoutingExpressionsTable({table}: RoutingExpressionsTableProps) {
    const rows = table.getRowModel().rows

    if (rows.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 text-center">
                <p className="font-medium">
                    Geen resultaten gevonden
                </p>
                <p className="text-sm text-muted-foreground">
                    Er zijn geen routing expressions die overeenkomen met je zoekopdracht.
                </p>
            </div>
        )
    }

    return (
        <Table className="bg-muted">
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
                {rows.map((row) => (
                    <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                <table.FlexRender cell={cell} />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}