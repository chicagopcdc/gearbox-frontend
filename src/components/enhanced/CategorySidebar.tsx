import type { CategorySummary } from './types'

type CategorySidebarProps = {
  categories: CategorySummary[]
  activeCategoryId: number | null
  onSelectCategory: (id: number) => void
}

function CategorySidebar({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategorySidebarProps) {
  return (
    <nav>
      <div className="text-xs uppercase tracking-wider text-gray-500 px-4 py-3 font-medium">
        Categories
      </div>
      <ul>
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId
          return (
            <li key={category.id}>
              <button
                onClick={() => onSelectCategory(category.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full text-left px-4 py-2 text-sm ${
                  isActive
                    ? 'border-l-4 border-primary bg-red-100 text-primary font-medium'
                    : 'border-l-4 border-transparent hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default CategorySidebar
