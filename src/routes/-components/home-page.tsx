import { Link } from "@tanstack/react-router"
import {IconPlus, IconListDetails, IconFlask, IconArrowUpRight,} from "@tabler/icons-react"
import {Badge} from "@/components/ui/badge.tsx";

const features = [
    {
        title: "Routeerregels beheren",
        description:
            "Bekijk, doorzoek en beheer bestaande routeerregels.",
        icon: IconListDetails,
        to: "/routing-expressions",
        isMain: true,
    },
    {
        title: "Routeerregel toevoegen",
        description:
            "Stel voorwaarden samen en bepaal waar meldingen terechtkomen.",
        icon: IconPlus,
        to: "/routing-expressions/create",
    },
    {
        title: "Routering simuleren",
        description:
            "Controleer welke routeerregel van toepassing is op een melding.",
        icon: IconFlask,
        to: "/routing-expressions/simulate",
    },
] as const

export function HomePage() {
    return (
        <div className="flex flex-col gap-8">
            <section className="rounded-lg bg-muted p-6 md:p-8">
                <div className="flex max-w-2xl flex-col items-start gap-4">
                    <div className="space-y-2">
                        <h1>Welkom bij Signalen Tools</h1>
                        <p className="text-muted-foreground">
                            Beheer routeerregels, stel voorwaarden samen
                            en test hoe meldingen naar de juiste afdeling
                            worden gerouteerd.
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h2>Wat wil je doen?</h2>
                    <p className="text-sm text-muted-foreground">
                        Kies een onderdeel om aan de slag te gaan.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon

                        return (
                            <Link
                                key={feature.to}
                                to={feature.to}
                                className="group flex h-full flex-col gap-4 rounded-lg border p-5 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            >
                                <div className="flex size-10 items-center justify-center rounded-md bg-secondary">
                                    <Icon size={22} stroke={1.75} />
                                </div>

                                {"isMain" in feature && feature.isMain && (
                                    <Badge variant="secondary">
                                        Hoofdoverzicht
                                    </Badge>
                                )}

                                <div className="flex flex-1 flex-col gap-2">
                                    <h3 className="text-base font-semibold">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 text-sm font-medium">
                                    Openen
                                    <IconArrowUpRight
                                        size={16}
                                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}