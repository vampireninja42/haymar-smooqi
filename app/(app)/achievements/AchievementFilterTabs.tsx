'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'streaks', label: 'Streaks' },
  { value: 'lessons', label: 'Lessons' },
  { value: 'quizzes', label: 'Quizzes' },
  { value: 'explorer', label: 'Explorer' },
] as const

export function AchievementFilterTabs({ activeFilter }: { activeFilter: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleFilterChange(filter: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (filter === 'all') {
      params.delete('filter')
    } else {
      params.set('filter', filter)
    }
    router.push(`/achievements?${params.toString()}`)
  }

  return (
    <div className="flex gap-1 overflow-x-auto rounded-full bg-gray-100 p-1">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => handleFilterChange(f.value)}
          className={cn(
            'flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
            activeFilter === f.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
