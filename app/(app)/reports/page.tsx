import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { themeConfig } from '@/lib/theme'
import { ReportsTabs } from './ReportsTabs'
import { BackButton } from '@/components/ui/BackButton'

export const dynamic = 'force-dynamic'

type TabValue = 'week' | 'month'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getMonday(): Date {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function getPreviousMonday(): Date {
  const monday = getMonday()
  const prev = new Date(monday)
  prev.setDate(prev.getDate() - 7)
  return prev
}

function getFirstOfMonth(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
}

function getFirstOfPreviousMonth(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0)
}

function getDaysInRange(start: Date, end: Date): Date[] {
  const days: Date[] = []
  const current = new Date(start)
  while (current < end) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return days
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  const userId = session.user.id

  const params = await searchParams
  const tab = (['week', 'month'].includes(params.tab ?? '') ? params.tab : 'week') as TabValue

  const now = new Date()
  const periodStart = tab === 'week' ? getMonday() : getFirstOfMonth()
  const prevPeriodStart = tab === 'week' ? getPreviousMonday() : getFirstOfPreviousMonth()
  const prevPeriodEnd = periodStart

  // Fetch data for current and previous periods
  const [
    user,
    currentXpLogs,
    prevXpLogs,
    currentLessons,
    ,
    currentQuizzes,
    ,
    currentReviews,
    ,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentStreak: true,
        bestStreak: true,
        xp: true,
        totalMinutes: true,
      },
    }),
    prisma.userXPLog.findMany({
      where: { userId, createdAt: { gte: periodStart } },
      select: { amount: true, createdAt: true },
    }),
    prisma.userXPLog.findMany({
      where: { userId, createdAt: { gte: prevPeriodStart, lt: prevPeriodEnd } },
      select: { amount: true },
    }),
    prisma.userProgress.count({
      where: { userId, lessonCompleted: true, lessonCompletedAt: { gte: periodStart } },
    }),
    prisma.userProgress.count({
      where: { userId, lessonCompleted: true, lessonCompletedAt: { gte: prevPeriodStart, lt: prevPeriodEnd } },
    }),
    prisma.userProgress.count({
      where: { userId, quizPassed: true, updatedAt: { gte: periodStart } },
    }),
    prisma.userProgress.count({
      where: { userId, quizPassed: true, updatedAt: { gte: prevPeriodStart, lt: prevPeriodEnd } },
    }),
    prisma.userReview.count({
      where: { userId, updatedAt: { gte: periodStart } },
    }),
    prisma.userReview.count({
      where: { userId, updatedAt: { gte: prevPeriodStart, lt: prevPeriodEnd } },
    }),
  ])

  if (!user) redirect('/login')

  const currentTotalXp = currentXpLogs.reduce((s, l) => s + l.amount, 0)
  const prevTotalXp = prevXpLogs.reduce((s, l) => s + l.amount, 0)

  // Approximate minutes from XP (1 XP ~ 0.5 min based on DailyGoalBlock pattern)
  const currentMinutes = Math.round(currentTotalXp / 2)
  const prevMinutes = Math.round(prevTotalXp / 2)
  const minutesDelta = currentMinutes - prevMinutes

  // Active days: days with at least 1 XP log
  const activeDaySet = new Set(
    currentXpLogs.map((l) => {
      const d = new Date(l.createdAt)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
  )
  const activeDays = activeDaySet.size

  // Build chart data
  const days = getDaysInRange(periodStart, now)
  const chartData = days.map((d) => {
    const dayStart = new Date(d)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(d)
    dayEnd.setHours(23, 59, 59, 999)
    const dayXp = currentXpLogs
      .filter((l) => l.createdAt >= dayStart && l.createdAt <= dayEnd)
      .reduce((s, l) => s + l.amount, 0)
    const minutes = Math.round(dayXp / 2)
    const dayOfWeek = d.getDay()
    const label = tab === 'week'
      ? DAY_LABELS[dayOfWeek === 0 ? 6 : dayOfWeek - 1]
      : `${d.getDate()}`
    const isToday = d.toDateString() === now.toDateString()
    return { label, minutes, isToday }
  })

  const maxMinutes = Math.max(...chartData.map((d) => d.minutes), 1)

  // Circular progress for goal
  const goalMinutes = tab === 'week' ? 105 : 450 // 15 min * 7 or 15 * 30
  const goalProgress = Math.min(currentMinutes / goalMinutes, 1)
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference * (1 - goalProgress)

  const statsGrid = [
    { label: 'Active Days', value: activeDays, icon: '📅' },
    { label: 'Lessons Done', value: currentLessons, icon: '📖' },
    { label: 'Quizzes Passed', value: currentQuizzes, icon: '✅' },
    { label: 'Reviews', value: currentReviews, icon: '🔄' },
    { label: 'Streak', value: user.currentStreak, icon: '🔥' },
    { label: 'Total XP', value: currentTotalXp, icon: '⚡' },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <BackButton href="/home" />
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <ReportsTabs activeTab={tab} />

      {/* Goal Achievement Card */}
      <div
        className={`rounded-[var(--card-radius)] p-6 shadow-sm ${
          themeConfig.isVA ? 'glass-card' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-6">
          {/* Circular progress */}
          <div className="relative h-24 w-24 flex-shrink-0">
            <svg viewBox="0 0 96 96" className="h-24 w-24 -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="6"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-gray-900">
                {Math.round(goalProgress * 100)}%
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {currentMinutes} min studied
            </p>
            <p className="text-xs text-gray-500">
              Goal: {goalMinutes} min {tab === 'week' ? 'this week' : 'this month'}
            </p>
            <div className="mt-2 flex items-center gap-1">
              {minutesDelta >= 0 ? (
                <span className="text-xs font-medium text-green-600">
                  +{minutesDelta} min vs last {tab === 'week' ? 'week' : 'month'}
                </span>
              ) : (
                <span className="text-xs font-medium text-red-500">
                  {minutesDelta} min vs last {tab === 'week' ? 'week' : 'month'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {statsGrid.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-[var(--card-radius)] p-3 text-center shadow-sm ${
              themeConfig.isVA ? 'glass-card' : 'bg-white'
            }`}
          >
            <span className="text-xl">{stat.icon}</span>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {stat.value.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Study time chart */}
      <div
        className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
          themeConfig.isVA ? 'glass-card' : 'bg-white'
        }`}
      >
        <p className="mb-3 text-sm font-semibold text-gray-700">Study Time</p>
        {chartData.every((d) => d.minutes === 0) ? (
          <p className="py-4 text-center text-xs text-gray-400">
            No study activity yet this {tab === 'week' ? 'week' : 'month'}
          </p>
        ) : (
          <div
            className="flex items-end gap-1"
            style={{ height: 80 }}
          >
            {chartData.map((day, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${Math.max((day.minutes / maxMinutes) * 60, 2)}px`,
                    backgroundColor: day.isToday
                      ? 'var(--color-primary)'
                      : day.minutes > 0
                        ? 'var(--color-primary-light)'
                        : '#E5E7EB',
                  }}
                />
                <span
                  className={`text-[8px] ${
                    day.isToday ? 'font-bold text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
