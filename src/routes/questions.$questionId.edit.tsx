import { createFileRoute } from "@tanstack/react-router"
import { QuestionsEditPage } from "@/routes/-components/questions-edit-page"

export const Route = createFileRoute("/questions/$questionId/edit")({
    staticData: {
        breadcrumb: {
            label: "Bewerken",
        },
    },
    component: QuestionsEditPage,
})