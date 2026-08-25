import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-65px)] max-w-5xl flex-col justify-center px-6 py-16">
      <div className="max-w-2xl space-y-6">
        <p className="text-sm font-medium text-muted-foreground">
          Vite + React + TanStack Router + shadcn
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
          Project klaar om uit te bouwen.
        </h1>
        <p className="text-lg text-muted-foreground">
          De router, Tailwind CSS en shadcn basiscomponenten zijn ingesteld.
        </p>
        <Button>shadcn button</Button>
      </div>
    </section>
  )
}
