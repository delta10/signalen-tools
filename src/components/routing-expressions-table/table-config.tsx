import {
    tableFeatures,
    columnFilteringFeature,
    globalFilteringFeature,
    columnVisibilityFeature,
    createFilteredRowModel,
    filterFn_includesString,
    type ReactTable,
    rowSortingFeature,
    createSortedRowModel,
    sortFns,
} from "@tanstack/react-table"
import type { RoutingExpressionTableRow } from "@/types/routing-expressions"

export const features = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    columnVisibilityFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns: {
        includesString: filterFn_includesString,
    },
    sortFns,
})

export type RoutingExpressionsTableInstance = ReactTable<typeof features, RoutingExpressionTableRow>