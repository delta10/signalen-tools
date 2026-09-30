import type {Expression, Questions, RoutingExpression,} from "@/types/routing-expressions"

{/* QUESTION/ASNWER FIXTURES */}
export const routingExpressionFixture = {
    _expression: "SingleQuestion",
} as RoutingExpression

export const expressionsFixture = [
    {
        name: "SingleQuestion",
        code: 'Textielcontainer_type_melding == "De textielcontainer is beschadigd"',
        _type: "routing",
    },
    {
        name: "MultipleAnswers",
        code:
            'Textielcontainer_type_melding == "De textielcontainer is beschadigd" or ' +
            'Textielcontainer_type_melding == "Anders"',
        _type: "routing",
    },
    {
        name: "SubjectQuestion",
        code: 'Onderwerp == "De textielcontainer is beschadigd"',
        _type: "routing",
    },
    {
        name: "CategoryOnly",
        code: 'sub == "Straatverlichting"',
        _type: "routing",
    },
] as Expression[]

export const questionsFixture = [
    {
        key: "Textielcontainer_type_melding",
        meta: JSON.stringify({
            values: {
                "De textielcontainer is beschadigd":
                    "De textielcontainer is beschadigd",
                "Anders": "Anders",
            },
        }),
    },
    {
        key: "Onderwerp",
        meta: JSON.stringify({
            values: {
                "De textielcontainer is beschadigd":
                    "De textielcontainer is beschadigd",
            },
        }),
    },
] as Questions[]

{/* AREA FIXTURES */}
export const areaRoutingExpressionFixture = {
    _expression: "SingleArea",
} as RoutingExpression

export const areaExpressionsFixture = [
    {
        name: "SingleArea",
        code: 'location in areas."district"."WK199101"',
        _type: "routing",
    },
    {
        name: "DifferentAreaType",
        code: 'location in areas."neighbourhood"."BU19910101"',
        _type: "routing",
    },
    {
        name: "CategoryOnly",
        code: 'sub == "Straatverlichting"',
        _type: "routing",
    },
] as Expression[]