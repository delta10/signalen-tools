import type {useRoutingExpressionForm} from "@/hooks/use-routing-expressions-form.ts";
import type {Questions} from "@/types/routing-expressions.ts";

type QuestionsMultiSelectProps = {
    form: ReturnType<typeof useRoutingExpressionForm>
    groupIndex: number
    questions: Questions[]
}

export function QuestionConditionEditor() {
    return(
        <>

        </>
    )
}