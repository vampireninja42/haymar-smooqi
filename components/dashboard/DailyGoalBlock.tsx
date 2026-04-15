'use client'

interface WeekDay {
  label: string
  minutes: number
}

interface DailyGoalBlockProps {
  currentStreak: number
  bestStreak: number
  totalLessonsDone: number
  totalMinutes: number
  weeklyData: WeekDay[]
}

export function DailyGoalBlock({
  currentStreak,
  bestStreak,
  totalLessonsDone,
  totalMinutes,
  weeklyData,
}: DailyGoalBlockProps) {
  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 1)

  return (
    <div className="rounded-[var(--card-radius)] bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">Your Activity</h3>

      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-[var(--color-primary)]">{currentStreak}</p>
          <p className="text-[10px] text-gray-400">Streak</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{bestStreak}</p>
          <p className="text-[10px] text-gray-400">Best</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{totalLessonsDone}</p>
          <p className="text-[10px] text-gray-400">Lessons</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{totalMinutes}</p>
          <p className="text-[10px] text-gray-400">Minutes</p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-1" style={{ height: 64 }}>
        {weeklyData.map((day) => (
          <div key={day.label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t"
              style={{
                height: `${Math.max((day.minutes / maxMinutes) * 48, 4)}px`,
                backgroundColor: day.minutes > 0 ? 'var(--color-primary)' : 'var(--color-primary-light)',
              }}
            />
            <span className="text-[10px] text-gray-400">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
