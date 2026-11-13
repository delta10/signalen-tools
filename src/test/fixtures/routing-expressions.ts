import type {Question} from "@/types/domain/reference-data.ts";
import type {Expression} from "@/types/domain/routing.ts";

/* Test fixtures */
export const questionsFixture: Question[] = [
    {
        id: 1,
        key: "Textielcontainer_type_melding",
        label: "Type melding",
        fieldType: "radio_input",
        required: false,
        answers: [
            {
                value: "De textielcontainer is beschadigd",
                label: "De textielcontainer is beschadigd",
            },
            {
                value: "Anders",
                label: "Anders",
            },
        ],
        categorySlugs: [],
    },
    {
        id: 2,
        key: "Onderwerp",
        label: "Onderwerp",
        fieldType: "radio_input",
        required: false,
        answers: [
            {
                value: "De textielcontainer is beschadigd",
                label: "De textielcontainer is beschadigd",
            },
        ],
        categorySlugs: [],
    },
]

export const expressionsFixture: Expression[] = [
    {
        id: 1,
        name: "SingleQuestion",
        code: 'Textielcontainer_type_melding == "De textielcontainer is beschadigd"',
        type: "routing",
        isActive: true,
        routing: null,
    },
    {
        id: 2,
        name: "MultipleAnswers",
        code:
            'Textielcontainer_type_melding == "De textielcontainer is beschadigd" or ' +
            'Textielcontainer_type_melding == "Anders"',
        type: "routing",
        isActive: true,
        routing: null,
    },
    {
        id: 3,
        name: "CategoryOnly",
        code: 'sub == "Textielcontainer"',
        type: "routing",
        isActive: true,
        routing: null,
    },
    {
        id: 4,
        name: "SubjectQuestion",
        code: 'Onderwerp == "De textielcontainer is beschadigd"',
        type: "routing",
        isActive: true,
        routing: null,
    },
    {
        id: 5,
        name: "DistrictArea",
        code: 'location in areas."district"."WK199101"',
        type: "routing",
        isActive: true,
        routing: null,
    },
    {
        id: 6,
        name: "DifferentAreaType",
        code: 'location in areas."neighbourhood"."BU19910101"',
        type: "routing",
        isActive: true,
        routing: null,
    },
]