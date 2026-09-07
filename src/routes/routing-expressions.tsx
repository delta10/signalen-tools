import {createFileRoute, Outlet} from '@tanstack/react-router'

export const Route = createFileRoute('/routing-expressions')({
  component: () => <Outlet />,
  staticData: {
    breadcrumb: {
      label: "Routing Expressions",
      to: "/routing-expressions",
    },
  },
})
