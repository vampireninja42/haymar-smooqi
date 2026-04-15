'use client'

import { themeConfig } from '@/lib/theme'
import { getXpForLevel } from '@/lib/xp'

interface DailyGoalBlockProps {
  minutesStudied: number
  dailyGoal: number
  streak: number
  level: number
  xp: number
  weeklyData: Array<{ day: string; minutes: number; isToday: boolean }>
}

export function DailyGoalBlock({
  minutesStudied,
  dailyGoal,
  streak,
  level,
  xp,
  weeklyData,
}: DailyGoalBlockProps) {
  const progress = Math.min(minutesStudied / dailyGoal, 1)
  const circumference = 2 * Math.PI * 24
  const strokeDashoffset = circumference * (1 - progress)

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 1)
  const allZero = weeklyData.every((d) => d.minutes === 0)

  const currentLevelXp = getXpForLevel(level)
  const nextLevelXp = getXpForLevel(level + 1)
  const xpInLevel = xp - currentLevelXp
  const xpNeeded = nextLevelXp - currentLevelXp
  const xpProgress = xpNeeded > 0 ? Math.min(xpInLevel / xpNeeded, 1) : 0

  return (
    <div
      className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
        themeConfig.isVA ? 'glass-card' : 'bg-white'
      }`}
    >
      {/* Top row: ring + title + streak */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* SVG circular progress ring */}
          <div className="relative h-14 w-14 flex-shrink-0">
            <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-gray-700">
                {minutesStudied}/{dailyGoal}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Daily Goal</p>
            <p className="text-xs text-gray-500">
              {minutesStudied} / {dailyGoal} min
            </p>
          </div>
        </div>

        {/* Streak badge */}
        {streak > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">
            🔥 {streak} days
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-400">
            🔥 0 days
          </span>
        )}
      </div>

      {/* Encouragement text */}
      <p className="mt-2 text-xs text-gray-500">
        {minutesStudied === 0
          ? `Start your ${dailyGoal} minutes today!`
          : minutesStudied >= dailyGoal
            ? 'Daily goal complete!'
            : `${dailyGoal - minutesStudied} more minutes to reach your goal`}
      </p>

      {/* This Week section */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">This Week</p>
        {allZero ? (
          <p className="text-xs text-gray-400">
            Complete your first lesson to see your weekly activity
          </p>
        ) : (
          <div className="flex items-end justify-between gap-1" style={{ height: 48 }}>
            {weeklyData.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${Math.max((day.minutes / maxMinutes) * 36, 2)}px`,
                    backgroundColor: day.isToday
                      ? 'var(--color-primary)'
                      : day.minutes > 0
                        ? 'var(--color-primary-light)'
                        : '#E5E7EB',
                  }}
                />
                <span
                  className={`text-[9px] ${
                    day.isToday ? 'font-bold text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Level row */}
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
          ⚡ Level {level}
        </span>
        <span className="text-xs font-medium text-gray-500">{xp} XP</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{ width: `${xpProgress * 100}%` }}
        />
      </div>
    </div>
  )
}
