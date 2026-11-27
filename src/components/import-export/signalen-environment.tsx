import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type Props = {
    url: string
    onSave: (url: string) => void
}

export function SignalenEnvironment({ url, onSave }: Props) {
    const [input, setInput] = useState(url)

    function handleSave() {
        try {
            const parsed = new URL(input.trim())

            if (!["http:", "https:"].includes(parsed.protocol)) {
                throw new Error()
            }

            if (parsed.username || parsed.password) {
                throw new Error()
            }

            const url = parsed.href.replace(/\/+$/, "")

            onSave(url)
            setInput(url)

            toast.success("Signalen-omgeving opgeslagen.")
        } catch {
            toast.error("Voer een geldige URL in.")
        }
    }

    return (
        <div className="space-y-3 rounded-lg border p-4">
            <div>
                <h2 className="font-medium">Signalen-omgeving</h2>
                <p className="text-sm text-muted-foreground">
                    Vul de URL van de Django-beheeromgeving van je
                    gemeente in om direct naar de benodigde gegevens
                    te navigeren.
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                <Input
                    type="url"
                    className="max-w-lg"
                    placeholder="https://voorbeeld.nl/signals/admin/"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                />
                <Button onClick={handleSave}>
                    Opslaan
                </Button>
            </div>
        </div>
    )
}