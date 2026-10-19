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
    sortFns, createPaginatedRowModel, rowPaginationFeature,
} from "@tanstack/react-table"
import type { RoutingExpressionTableRow } from "@/types/routing-expressions"

export const features = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    columnVisibilityFeature,
    rowSortingFeature,
    rowPaginationFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filterFns: {
        includesString: filterFn_includesString,
    },
    sortFns,
})

export type RoutingExpressionsTableInstance = ReactTable<typeof features, RoutingExpressionTableRow>