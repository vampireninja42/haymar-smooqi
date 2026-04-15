'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
] as const

export function LeaderboardTabs({ activeTab }: { activeTab: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleTabChange(tab: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.push(`/leaderboard?${params.toString()}`)
  }

  return (
    <div className="flex gap-1 rounded-full bg-gray-100 p-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabChange(tab.value)}
          className={cn(
            'flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors',
            activeTab === tab.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
