import type { ActionProps } from "react-querybuilder"
import { IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function RoutingRemoveRule(props: ActionProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            disabled={props.disabled}
            onClick={props.handleOnClick}
            aria-label="Verwijder voorwaarde"
        >
            <IconTrash size={16} />
        </Button>
    )
}