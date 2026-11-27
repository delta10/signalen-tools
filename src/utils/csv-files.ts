import Papa from "papaparse"

export async function readCsvFile(file: File): Promise<Record<string, string>[]> {
    const content = await file.text()

    const result = Papa.parse<Record<string, string>>(
        content,
        {
            header: true,
            skipEmptyLines: "greedy",
            transformHeader: (header) => header.trim(),
        }
    )

    if (result.errors.length > 0) {
        throw new Error(
            "Het CSV-bestand kon niet correct worden uitgelezen."
        )
    }

    if (result.data.length === 0) {
        throw new Error(
            "Het CSV-bestand bevat geen gegevens."
        )
    }

    return result.data
}