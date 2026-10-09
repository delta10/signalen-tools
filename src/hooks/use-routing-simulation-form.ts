import type {RoutingSimulationFormData} from "@/types/routing-simulations.ts";
import {useForm} from "@tanstack/react-form";

const defaultValues: RoutingSimulationFormData = {
    category: "",
    area: "",
    question: "",
    answer: ""
}

export function useRoutingSimulationForm() {
    return useForm({
        defaultValues,
        onSubmit: async ({value}) => {
            console.log(value)
        },
    })
}