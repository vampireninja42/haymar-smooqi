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
      <div className="flex items-center gap-4">
        {/* Stats row - horizontal */}
        <div className="flex gap-4 text-center shrink-0">
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
            <p className="text-[10px] text-gray-400">Min</p>
          </div>
        </div>

        {/* Chart - compact, beside stats */}
        <div className="flex flex-1 items-end justify-between gap-1" style={{ height: 40 }}>
          {weeklyData.map((day) => (
            <div key={day.label} className="flex flex-1 flex-col items-center gap-0.5">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${Math.max((day.minutes / maxMinutes) * 32, 3)}px`,
                  backgroundColor: day.minutes > 0 ? 'var(--color-primary)' : 'var(--color-primary-light)',
                }}
              />
              <span className="text-[9px] text-gray-400">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
