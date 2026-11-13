import {CreateForm} from "@/components/expressions/create-form.tsx";

export function RoutingExpressionsCreatePage() {
    return (
        <div className="w-full min-w-0 space-y-6">
            <h1>Routing Expression Toevoegen</h1>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <section className="min-w-0 xl:col-span-2">
                    <CreateForm />
                </section>

                <aside className="min-w-0 xl:col-span-1">
                    <h2>JSON</h2>
                    <textarea
                        id="JSON"
                        className="min-h-64 w-full rounded-md bg-muted p-3"
                        placeholder="Hier komt het JSON veld..."
                    />
                </aside>
            </div>
        </div>
    )
}