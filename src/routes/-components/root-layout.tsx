import { Outlet } from '@tanstack/react-router'
import { AppSidebar } from "@/components/layout/app-sidebar.tsx";
import { AppHeader } from "@/components/layout/app-header.tsx";
import {Toaster} from "sonner";

export function RootLayout() {
  return (
      <div className="grid min-h-screen grid-cols-[16rem_minmax(0,1fr)] grid-rows-[auto_1fr] bg-muted">
          <aside className="row-span-2 p-4 pr-0">
              <AppSidebar />
          </aside>

          <header className="p-4 pb-0">
              <AppHeader />
          </header>

          <main className="m-4 min-w-0 overflow-auto rounded-lg bg-background p-6">
              <Outlet />
              <Toaster />
          </main>
      </div>
  )
}
