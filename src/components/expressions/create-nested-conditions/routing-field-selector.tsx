import type { FieldSelectorProps } from "react-querybuilder"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"

export function RoutingFieldSelector(props: FieldSelectorProps) {
    return (
        <Select
            value={props.value}
            onValueChange={props.handleOnChange}
            disabled={props.disabled}
        >
            <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Type voorwaarde" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="category">
                    Categorie
                </SelectItem>
                <SelectItem value="area">
                    Gebied
                </SelectItem>
            </SelectContent>
        </Select>
    )
}