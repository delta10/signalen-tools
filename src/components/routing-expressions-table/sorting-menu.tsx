import { Button } from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { IconArrowsSort } from "@tabler/icons-react"
import type {RoutingExpressionsTableInstance} from "@/components/routing-expressions-table/table-config"

type SortingMenuProps = {
    table: RoutingExpressionsTableInstance
}

export function SortingMenu({ table }: SortingMenuProps) {
    const sorting = table.state.sorting
    const currentSort = sorting?.[0]

    const isSelected = (id: string, desc: boolean) =>
        currentSort?.id === id && currentSort?.desc === desc

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <IconArrowsSort />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem
                    disabled={isSelected("name", false)}
                    onSelect={() =>
                        table.setSorting([{ id: "name", desc: false }])
                    }
                >
                    Naam: A–Z
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={isSelected("name", true)}
                    onSelect={() =>
                        table.setSorting([{ id: "name", desc: true }])
                    }
                >
                    Naam: Z–A
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={isSelected("order", false)}
                    onSelect={() =>
                        table.setSorting([{ id: "order", desc: false }])
                    }
                >
                    Prioriteit: hoog naar laag
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={isSelected("order", true)}
                    onSelect={() =>
                        table.setSorting([{ id: "order", desc: true }])
                    }
                >
                    Prioriteit: laag naar hoog
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}