export function HighlightText({text, searchTerm,}: { text: string, searchTerm: string }) {
    if (!searchTerm) {
        return <>{text}</>
    }

    const escapedSearchTerm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    )

    const regex = new RegExp(`(${escapedSearchTerm})`, "gi")
    const parts = text.split(regex)

    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === searchTerm.toLowerCase() ? (
                    <mark key={index}>
                        {part}
                    </mark>
                ) : (part)
            )}
        </>
    )
}