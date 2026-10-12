/* Read and parse a JSON file */
export async function readJsonFile<T>(file: File): Promise<T> {
    const content = await file.text()

    return JSON.parse(content) as T
}

/* Download data as a JSON file */
export function downloadJsonFile(filename: string, data: unknown): void {
    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    )

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = filename

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}