import {Button} from "@/components/ui/button.tsx";
import {Link} from "@tanstack/react-router";
import { IconPlus } from '@tabler/icons-react';
import { IconFlask } from '@tabler/icons-react';

export function RoutingExpressionsPage() {
    return(
        <>
            <h1>Routing Expressions</h1>
            <div className={"flex flex-col items-end lg:flex-row lg:justify-end gap-4"}>
                <Button className={"rounded-sm lg:order-2"} size={"lg"} asChild>
                    <Link to={"/routing-expressions/create"} className={"flex items-center gap-1"}>
                        <IconPlus data-icon={"inline-start"} /> Routing Expression Toevoegen
                    </Link>
                </Button>
                <Button className={"rounded-sm lg:order-1"} variant={"secondary"} size={"lg"} asChild>
                    <Link to={"/routing-expressions/test"} className={"flex items-center gap-1"}>
                        <IconFlask data-icon={"inline-start"} /> Routing Testen
                    </Link>
                </Button>
            </div>
        </>
    )
}