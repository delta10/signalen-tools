import { useQuery } from "@tanstack/react-query"
import { ReferenceDataOverview } from "@/components/import-export/reference-data-overview"
import { getDepartments } from "@/services/departments"

export function HomePage() {
    const { data: departments = [] } = useQuery({
        queryKey: ["departments"],
        queryFn: getDepartments,
    })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold">
                    Welkom bij Signalen Tools
                </h1>
                <p className="text-muted-foreground">
                    Beheer de gegevens die nodig zijn voor het
                    aanmaken en testen van routeringsregels.
                </p>
            </div>

            <ReferenceDataOverview departments={departments} />
        </div>
    )
}