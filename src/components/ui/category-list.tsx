import {useState} from "react";

export function ExpandableCategoryList({categories,}: { categories: string[] }) {
    const [showAll, setShowAll] = useState(false)

    const visibleCategories = showAll
        ? categories
        : categories.slice(0, 3)

    return (
        <div>
            {visibleCategories.join(", ")}

            {categories.length > 3 && (
                <button type="button" onClick={() => setShowAll(!showAll)} className="ml-2 px-2 rounded-lg font-medium hover:bg-secondary hover:cursor-pointer">
                    {showAll
                        ? "Minder tonen"
                        : `+${categories.length - 3} meer`}
                </button>
            )}
        </div>
    )
}