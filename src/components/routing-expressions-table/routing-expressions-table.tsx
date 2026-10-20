import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import type {RoutingExpressionsTableInstance} from "@/components/routing-expressions-table/table-config"
import {Button} from "@/components/ui/button.tsx";
import {IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight} from "@tabler/icons-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

type RoutingExpressionsTableProps = {
    table: RoutingExpressionsTableInstance
}

export function RoutingExpressionsTable({table}: RoutingExpressionsTableProps) {
    const rows = table.getRowModel().rows

    const { pageIndex, pageSize } = table.state.pagination
    const rowCount = table.getRowCount()
    const pageCount = table.getPageCount()

    const firstRow = pageIndex * pageSize + 1
    const lastRow = Math.min((pageIndex + 1) * pageSize, rowCount)

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
        <div>
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
            <div className="flex items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Rijen per pagina
                    </span>
                    <Select value={String(pageSize)} onValueChange={(value) => table.setPageSize(Number(value))}>
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 8, 10, 20, 50].map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        {rowCount === 0
                            ? "0 resultaten"
                            : `${firstRow}-${lastRow} van ${rowCount}`}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                            <IconChevronsLeft />
                        </Button>

                        <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            <IconChevronLeft />
                        </Button>

                        <span className="px-2 text-sm whitespace-nowrap">
                            {pageIndex + 1} / {pageCount}
                        </span>

                        <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            <IconChevronRight />
                        </Button>

                        <Button variant="outline" size="icon" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
                            <IconChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}