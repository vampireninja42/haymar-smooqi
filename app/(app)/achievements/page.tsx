import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { themeConfig } from '@/lib/theme'
import { Badge } from '@/components/ui/badge'
import { AchievementFilterTabs } from './AchievementFilterTabs'

export const dynamic = 'force-dynamic'

type AchievementRequirement = {
  type: string
  value: number
}

const TIER_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  bronze: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  silver: { bg: 'bg-gray-200', text: 'text-gray-700', border: 'border-gray-300' },
  gold: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400' },
}

function getUserStatForRequirement(
  reqType: string,
  stats: { bestStreak: number; totalLessonsDone: number; quizzesPassed: number; coursesCompleted: number; topicsSelected: number }
): number {
  switch (reqType) {
    case 'streak_days': return stats.bestStreak
    case 'lessons_completed': return stats.totalLessonsDone
    case 'quizzes_passed': return stats.quizzesPassed
    case 'courses_completed': return stats.coursesCompleted
    case 'topics_selected': return stats.topicsSelected
    default: return 0
  }
}

export default async function AchievementsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const userId = session.user.id

  const params = await searchParams
  const filter = params.filter ?? 'all'

  const [allAchievements, userAchievements, user, quizzesPassed, coursesCompleted, topicsSelected] =
    await Promise.all([
      prisma.achievement.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { bestStreak: true, totalLessonsDone: true, currentStreak: true },
      }),
      prisma.userProgress.count({ where: { userId, quizPassed: true } }),
      prisma.userProgress.count({ where: { userId, courseCompleted: true, lessonId: null } }),
      prisma.userTopicSelection.count({ where: { userId } }),
    ])

  if (!user) redirect('/login')

  const stats = {
    bestStreak: user.bestStreak,
    totalLessonsDone: user.totalLessonsDone,
    quizzesPassed,
    coursesCompleted,
    topicsSelected,
  }

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId))
  const unlockedMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt]))

  const totalCount = allAchievements.length
  const unlockedCount = userAchievements.length
  const progressPct = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  // Category mapping for filters
  const categoryMap: Record<string, string[]> = {
    streaks: ['streak_days'],
    lessons: ['lessons_completed', 'courses_completed'],
    quizzes: ['quizzes_passed', 'perfect_quiz', 'perfect_quiz_streak'],
    explorer: ['topics_selected', 'topics_started', 'topics_completed', 'daily_challenges', 'daily_challenge_streak', 'referrals'],
  }

  const filtered = filter === 'all'
    ? allAchievements
    : allAchievements.filter((a) => {
        const req = a.requirement as AchievementRequirement
        return categoryMap[filter]?.includes(req.type)
      })

  const unlocked = filtered.filter((a) => unlockedIds.has(a.id))
  const locked = filtered.filter((a) => !unlockedIds.has(a.id))

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
          <span className="text-sm font-medium text-gray-500">
            {unlockedCount} / {totalCount} unlocked
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progressPct}%`,
              backgroundColor: 'var(--color-primary)',
            }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3">
        <div
          className={`flex-1 rounded-full px-4 py-2 text-center ${
            themeConfig.isVA ? 'glass-card' : 'bg-white shadow-sm'
          }`}
        >
          <p className="text-lg font-bold text-gray-900">{stats.bestStreak}</p>
          <p className="text-[10px] text-gray-500">Best Streak</p>
        </div>
        <div
          className={`flex-1 rounded-full px-4 py-2 text-center ${
            themeConfig.isVA ? 'glass-card' : 'bg-white shadow-sm'
          }`}
        >
          <p className="text-lg font-bold text-gray-900">{coursesCompleted}</p>
          <p className="text-[10px] text-gray-500">Courses Done</p>
        </div>
        <div
          className={`flex-1 rounded-full px-4 py-2 text-center ${
            themeConfig.isVA ? 'glass-card' : 'bg-white shadow-sm'
          }`}
        >
          <p className="text-lg font-bold text-gray-900">{quizzesPassed}</p>
          <p className="text-[10px] text-gray-500">Quizzes Passed</p>
        </div>
      </div>

      {/* Filter tabs */}
      <AchievementFilterTabs activeFilter={filter} />

      {/* Unlocked section */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Unlocked
          </h2>
          <div className="grid gap-3">
            {unlocked.map((a) => {
              const tier = TIER_STYLES[a.tier] ?? TIER_STYLES.bronze
              const unlockedAt = unlockedMap.get(a.id)

              return (
                <div
                  key={a.id}
                  className={`rounded-[var(--card-radius)] border p-4 shadow-sm ${tier.bg} ${tier.border} ${
                    themeConfig.isVA ? 'glass-card' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{a.name}</p>
                        <Badge
                          className={`${tier.bg} ${tier.text} border-0 text-[10px] capitalize`}
                        >
                          {a.tier}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-600">{a.description}</p>
                      {unlockedAt && (
                        <p className="mt-1 text-[10px] text-gray-400">
                          Unlocked{' '}
                          {new Date(unlockedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Next to unlock section */}
      {locked.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Next to Unlock
          </h2>
          <div className="grid gap-3">
            {locked.map((a) => {
              const req = a.requirement as AchievementRequirement
              const current = getUserStatForRequirement(req.type, stats)
              const remaining = Math.max(req.value - current, 0)

              return (
                <div
                  key={a.id}
                  className={`relative rounded-[var(--card-radius)] border border-gray-200 p-4 shadow-sm ${
                    themeConfig.isVA ? 'glass-card' : 'bg-white'
                  }`}
                >
                  {/* Lock overlay */}
                  <div className="absolute inset-0 rounded-[var(--card-radius)] bg-white/60 backdrop-blur-[1px]" />

                  <div className="relative flex items-start gap-3">
                    <span className="text-3xl grayscale opacity-50">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-400">{a.name}</p>
                        <Badge variant="outline" className="text-[10px] capitalize text-gray-400">
                          {a.tier}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400">{a.description}</p>
                      {remaining > 0 && (
                        <p className="mt-1 text-[10px] font-medium text-gray-500">
                          {remaining} more to go
                        </p>
                      )}
                    </div>
                    <span className="text-lg text-gray-300">🔒</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
