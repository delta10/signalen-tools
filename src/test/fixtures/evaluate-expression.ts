import type {Category} from "@/types/domain/reference-data.ts";

export const categoriesFixture = [
    { id: 1, slug: "bank", name: "Bank" },
    { id: 2, slug: "straatverlichting", name: "Straatverlichting" },
] as Category[]

export const expressionCodeFixture =
    '((sub == "Bank" or (sub == "Straatverlichting" and Testvragen_checkbox_2 == "1")) ' +
    'and ((location in areas."district"."WK199101" or location in areas."district"."WK194804")))'