import {CreateForm} from "@/components/create-routing-expression/create-form.tsx";

export function RoutingExpressionsCreatePage() {
    return(
        <>
            <h1>Routing Expression Toevoegen</h1>
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 min-w-0">
                    <CreateForm />
                </div>

                <div className="col-span-1 min-w-0">
                    <h2>JSON</h2>
                    <textarea
                        id={"JSON"}
                        className="w-full bg-muted"
                        placeholder="Hier komt het JSON veld..."
                    />
                </div>
            </div>
        </>
    )
}