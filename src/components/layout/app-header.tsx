import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Link, useMatches, useLocation} from "@tanstack/react-router";
import {Fragment} from "react";

export function AppHeader() {
    const matches = useMatches();

    const pathname = useLocation({
        select: (location) => location.pathname
    });

    const isHome = pathname === "/";

    const breadcrumbMatches = matches.filter(
        (match) =>
            match.staticData?.breadcrumb &&
            match.staticData.breadcrumb.to !== "/"
    )

    return(
        <>
            <div className="flex h-full items-center justify-between rounded-lg bg-background p-3 lg:p-4">
                <div className="flex items-center gap-1 text-sm lg:gap-2 lg:text-base">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                {isHome ? (
                                    <BreadcrumbPage className="flex items-center gap-2">
                                        Home
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link
                                            to="/"
                                            className="flex items-center gap-2 hover:underline"
                                        >
                                            Home
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {breadcrumbMatches.length > 0 && <BreadcrumbSeparator />}
                            {breadcrumbMatches.map((match, index) => {
                                const breadcrumb = match.staticData.breadcrumb!
                                const isLast = index === breadcrumbMatches.length - 1
                                return (
                                    <Fragment key={match.id}>
                                        <BreadcrumbItem>
                                            {isLast || !breadcrumb.to ? (
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