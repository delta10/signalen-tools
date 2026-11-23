import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/questions")({
    staticData: {
        breadcrumb: {
            label: "Aanvullende vragen",
            to: "/questions",
        },
    },
    component: () => <Outlet />,
})