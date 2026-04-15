'use client'

import { useState, Suspense } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { FilterDrawer } from './FilterDrawer'

interface Topic {
  slug: string
  name: string
  icon: string
}

interface FilterButtonProps {
  topics: Topic[]
  totalCount: number
  activeFilterCount: number
}

export function FilterButton({ topics, totalCount, activeFilterCount }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex shrink-0 items-center gap-1.5 rounded-[var(--button-radius)] border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
            {activeFilterCount}
          </span>
        )}
      </button>
      <Suspense>
        <FilterDrawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          topics={topics}
          totalCount={totalCount}
        />
      </Suspense>
    </>
  )
}
