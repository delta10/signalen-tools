import {
    tableFeatures,
    columnFilteringFeature,
    globalFilteringFeature,
    columnVisibilityFeature,
    createFilteredRowModel,
    filterFn_includesString,
    type ReactTable,
} from "@tanstack/react-table"
import type { RoutingExpressionTableRow } from "@/types/routing-expressions"

export const features = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    columnVisibilityFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns: {
        includesString: filterFn_includesString,
    },
})

export type RoutingExpressionsTableInstance = ReactTable<typeof features, RoutingExpressionTableRow>