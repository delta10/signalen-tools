export function validateManualExpression(code: string): string | undefined {
    const value = code.trim()

    // Expression cannot be empty
    if (!value) {
        return "Voer een expression-code in."
    }

    // Full JSON objects are not accepted
    if (value.startsWith("{") || value.startsWith('"code"') || value.startsWith("'code'")) {
        return "Voer alleen de expression-code in, zonder JSON-object."
    }

    // Check balanced parentheses and quotation marks
    let depth = 0
    let inQuotes = false
    let escaped = false

    for (const char of value) {
        if (escaped) {
            escaped = false
            continue
        }

        if (char === "\\" && inQuotes) {
            escaped = true
            continue
        }

        if (char === '"') {
            inQuotes = !inQuotes
            continue
        }

        if (inQuotes) continue

        if (char === "(") depth++
        if (char === ")") depth--

        if (depth < 0) {
            return "De haakjes in de expression zijn niet correct."
        }
    }

    if (depth !== 0) {
        return "De haakjes in de expression zijn niet correct."
    }

    if (inQuotes) {
        return "Er ontbreekt een afsluitend aanhalingsteken."
    }

    return undefined
}