import { Button } from "@/components/ui/button"
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuItem} from "@/components/ui/dropdown-menu"
import { IconColumns3 } from "@tabler/icons-react"
import type {RoutingExpressionsTableInstance} from "@/components/routing-expressions-table/table-config"

type ColumnVisibilityMenuProps = {
    table: RoutingExpressionsTableInstance
    onReset: () => void
}

export function ColumnVisibilityMenu({table, onReset}: ColumnVisibilityMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <IconColumns3 />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-max min-w-48">
                {table.getAllLeafColumns().map((column) => (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        disabled={!column.getCanHide()}
                        onCheckedChange={(checked) =>
                            column.toggleVisibility(checked)
                        }
                    >
                        {String(column.columnDef.header)}
                    </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={onReset} disabled={table.getIsAllColumnsVisible()}>
                    Standaardweergave herstellen
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}