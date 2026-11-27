import { createFileRoute } from '@tanstack/react-router'
import {QuestionsCreatePage} from "@/routes/-components/questions-create-page.tsx";

export const Route = createFileRoute('/questions/create')({
    staticData: {
        breadcrumb: {
            label: "Toevoegen",
            to: "/questions/create",
        },
    },
    component: QuestionsCreatePage,
})
