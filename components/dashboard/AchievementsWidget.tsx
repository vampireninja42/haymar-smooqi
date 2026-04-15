'use client'

import Link from 'next/link'

interface AchievementsWidgetProps {
  achievementCount: number
}

export function AchievementsWidget({ achievementCount }: AchievementsWidgetProps) {
  return (
    <Link
      href="/achievements"
      className="flex items-center justify-between rounded-[var(--card-radius)] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">&#127941;</span>
        <div>
          <p className="text-sm font-semibold text-gray-900">Achievements</p>
          <p className="text-xs text-gray-500">{achievementCount} unlocked</p>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-gray-400">
        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
      </svg>
    </Link>
  )
}
