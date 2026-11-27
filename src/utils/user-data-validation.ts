import type { UserTransfer } from "@/types/import-export/expressions"

export function validateUserTransfers(rows: Record<string, string>[]): UserTransfer[] {
    const emails = new Set<string>()
    const requiredColumns = ["E-mailadres", "Actief", "Afdeling(en)"]

    if (!rows.length || requiredColumns.some(column => !(column in rows[0]))) {
        throw new Error(
            "Het CSV-bestand bevat niet alle vereiste kolommen."
        )
    }

    const validRows = rows.filter(
        (row) => row["E-mailadres"]?.trim()
    )

    if (validRows.length === 0) {
        throw new Error(
            "Het CSV-bestand bevat geen gebruikers met een e-mailadres."
        )
    }

    return validRows.map((row) => {
        const email = row["E-mailadres"].trim()
        const active = row["Actief"]?.trim()
        const departments = row["Afdeling(en)"]

        if (!email.includes("@")) {
            throw new Error(
                `Ongeldig e-mailadres: "${email}".`
            )
        }

        if (active !== "Ja" && active !== "Nee") {
            throw new Error(
                `Ongeldige actief-status bij "${email}".`
            )
        }

        if (typeof departments !== "string") {
            throw new Error(
                'De kolom "Afdeling(en)" ontbreekt of is ongeldig.'
            )
        }

        const normalizedEmail = email.toLowerCase()
        emails.add(normalizedEmail)

        return {
            "E-mailadres": email,
            Actief: active,
            "Afdeling(en)": departments.trim(),
        }
    })
}