import type {Category} from "@/types/routing-expressions-create.ts";
import type {Area} from "@/types/routing-expressions.ts";
import type {RoutingSimulationData} from "@/types/routing-simulations.ts";

export const categoriesFixture: Category[] = [
    {
        parent: "wegen-verkeer-en-straatmeubilair",
        slug: "straatverlichting",
        name: "Straatverlichting",
        public_name: "",
        is_public_accessible: "1",
        configuration: null,
        handling: "",
        handling_message: "",
        is_active: "1",
        description: "",
        note: "",
        icon: "",
    },
    {
        parent: "afval",
        slug: "textielcontainer",
        name: "Textielcontainer",
        public_name: "",
        is_public_accessible: "1",
        configuration: null,
        handling: "",
        handling_message: "",
        is_active: "1",
        description: "",
        note: "",
        icon: "",
    },
]

export const areasFixture: Area[] = [
    {
        code: "WK199101",
        name: "Uden",
        _type: "district",
        geometry: ""
    },
    {
        code: "WK199102",
        name: "Veghel",
        _type: "district",
        geometry: ""
    },
]

export const simulationDataFixture: RoutingSimulationData = {
    category: "straatverlichting",
    area: "Uden",
    question: "",
    answer: "",
}