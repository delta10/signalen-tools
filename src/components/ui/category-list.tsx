import {useState} from "react";
import {HighlightText} from "@/components/ui/highlight-text.tsx";

export function ExpandableCategoryList({categories, searchTerm}: { categories: string[], searchTerm: string }) {
    const [showAll, setShowAll] = useState(false)

    const visibleCategories = showAll
        ? categories
        : categories.slice(0, 3)

    return (
        <div>
            {visibleCategories.map((category, index) => (
                <span key={category}>
                    <HighlightText text={category} searchTerm={searchTerm}/>
                    {index < visibleCategories.length - 1 && ", "}
                </span>
            ))}

            {categories.length > 3 && (
                <button type="button" onClick={() => setShowAll(!showAll)}
                        className="ml-2 px-2 rounded-lg font-medium hover:bg-secondary hover:cursor-pointer">
                    {showAll
                        ? "Minder tonen"
                        : `+${categories.length - 3} meer`}
                </button>
            )}
        </div>
    )
}