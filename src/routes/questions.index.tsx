import { createFileRoute } from "@tanstack/react-router"
import { QuestionsPage } from "@/routes/-components/questions-page"

export const Route = createFileRoute("/questions/")({
    component: QuestionsPage,
})