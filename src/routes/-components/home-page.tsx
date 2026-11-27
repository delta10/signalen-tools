import { useQuery } from "@tanstack/react-query"
import { ReferenceDataOverview } from "@/components/import-export/reference-data-overview"
import { getDepartments } from "@/services/departments"
import {useState} from "react";
import {SignalenEnvironment} from "@/components/import-export/signalen-environment.tsx";

export function HomePage() {
    const [signalenUrl, setSignalenUrl] = useState(() => localStorage.getItem("signalen-url") ?? "")

    function saveSignalenUrl(url: string) {
        localStorage.setItem("signalen-url", url)
        setSignalenUrl(url)
    }

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

            <SignalenEnvironment url={signalenUrl} onSave={saveSignalenUrl} />

            <ReferenceDataOverview departments={departments} signalenUrl={signalenUrl} />
        </div>
    )
}