import { Link } from "@tanstack/react-router"

{/* Expandable by adding links here */}
const navigationItems = [
    {
        label: "Routing Expressions",
        to: "/routing-expressions"
    }
]
export function AppSidebar() {
    return(
        <div className="h-full rounded-lg bg-background p-4">
            <Link to={"/"} className="mb-4 block font-semibold">
                Signalen
            </Link>

            <nav className="flex flex-col gap-1">
                {navigationItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                        activeProps={{
                            className: "bg-muted font-medium",
                        }}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    )
}