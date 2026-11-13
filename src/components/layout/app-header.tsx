import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Link, useMatches} from "@tanstack/react-router";
import {Fragment} from "react";

export function AppHeader() {
    const matches = useMatches();

    const routeBreadcrumbs = matches
        .filter((match) => match.staticData?.breadcrumb)
        .map((match) => match.staticData.breadcrumb!)

    const isHome = matches.some(
        (match) => match.routeId === "/"
    )

    const breadcrumbs = isHome
        ? routeBreadcrumbs
        : [
            { label: "Home", to: "/" as const },
            ...routeBreadcrumbs,
        ]

    return(
        <>
            <div className="flex h-full items-center justify-between rounded-lg bg-background p-3 lg:p-4">
                <div className="flex items-center gap-1 text-sm lg:gap-2 lg:text-base">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbs.map((breadcrumb, index) => {
                                const isLast = index === breadcrumbs.length - 1
                                return (
                                    <Fragment key={breadcrumb.to}>
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage>
                                                    {breadcrumb.label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link to={breadcrumb.to}>
                                                        {breadcrumb.label}
                                                    </Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        {!isLast && <BreadcrumbSeparator />}
                                    </Fragment>
                                )
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
        </>
    )
}