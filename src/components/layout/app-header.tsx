export function AppHeader() {
    return(
        <>
            <div className="flex h-full items-center justify-between rounded-lg bg-background p-3 lg:p-4">
                {/* Will be Breadcrumbs component */ }
                <div className="flex items-center gap-1 text-sm lg:gap-2 lg:text-base">
                    <span className="text-muted-foreground">
                      Scherm 1
                    </span>

                    <span className="text-muted-foreground">
                      /
                    </span>

                    <span className="font-medium">
                      Huidige scherm
                    </span>
                </div>
            </div>
        </>
    )
}