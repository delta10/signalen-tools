import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/routes/-components/home-page'

export const Route = createFileRoute('/')({
  staticData: {
    breadcrumb: {
      label: "Home",
      to: "/"
    },
  },
  component: HomePage,
})
