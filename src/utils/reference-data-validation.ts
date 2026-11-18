type RecordValidator = (value: unknown) => boolean

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)

const hasStringFields = (value: unknown, fields: string[]): boolean =>
    isRecord(value) &&
    fields.every((field) => typeof value[field] === "string")

const validators = {
    categories: (value: unknown) =>
        hasStringFields(value, ["slug", "name"]),

    areas: (value: unknown) =>
        hasStringFields(value, ["name", "code", "_type"]),

    departments: (value: unknown) =>
        hasStringFields(value, ["code", "name", "is_intern"]),

    questions: (value: unknown) =>
        hasStringFields(value, [
            "key",
            "field_type",
            "meta",
            "required",
            "categories",
        ]),
} satisfies Record<string, RecordValidator>

export type ReferenceDataType = keyof typeof validators

export function validateReferenceData(data: unknown, type: ReferenceDataType): void {
    if (!Array.isArray(data)) {
        throw new Error("Het JSON-bestand moet een array bevatten.")
    }

    const isValid = data.every(validators[type])

    if (!isValid) {
        throw new Error(
            `Het bestand bevat ongeldige gegevens voor ${type}.`
        )
    }
}