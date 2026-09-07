import {Button} from "@/components/ui/button.tsx";
import {Link} from "@tanstack/react-router";

export function RoutingExpressionsPage() {
    return(
        <>
            <h1>Routing Expressions</h1>
            <div className={"flex justify-end gap-4"}>
                <Button className={"rounded-sm"} variant={"secondary"} size={"lg"}>
                    Melding Testen
                </Button>
                <Button className={"rounded-sm"} size={"lg"}>
                    <Link to={"/routing-expressions/create"}>
                        Routing Expression Toevoegen
                    </Link>
                </Button>
            </div>
        </>
    )
}