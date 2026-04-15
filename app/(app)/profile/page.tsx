import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { themeConfig } from '@/lib/theme'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProfileEditForm } from './ProfileEditForm'

export const dynamic = 'force-dynamic'

const AVATAR_COLORS = [
  '#7C3AED', '#E11D48', '#059669', '#2563EB',
  '#EA580C', '#0891B2', '#D97706', '#4F46E5',
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const userId = session.user.id

  const [user, recentAchievements, topicSelections] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        provider: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        totalLessonsDone: true,
        totalMinutes: true,
        bestStreak: true,
        currentStreak: true,
        xp: true,
        level: true,
      },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
      take: 5,
      include: { achievement: true },
    }),
    prisma.userTopicSelection.findMany({
      where: { userId },
      include: { topic: { select: { name: true, icon: true, slug: true } } },
      orderBy: { position: 'asc' },
    }),
  ])

  if (!user) redirect('/login')

  const displayName = user.name ?? 'User'
  const initials = getInitials(displayName)
  const avatarColor = getAvatarColor(displayName)

  const planLabel =
    user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing'
      ? 'Premium'
      : 'Free'

  const statItems = [
    { label: 'Lessons', value: user.totalLessonsDone },
    { label: 'Minutes', value: user.totalMinutes },
    { label: 'Best Streak', value: user.bestStreak },
    { label: 'Topics', value: topicSelections.length },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      {/* Profile card */}
      <div
        className={`rounded-[var(--card-radius)] p-6 shadow-sm ${
          themeConfig.isVA ? 'glass-card' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {displayName}
              </h2>
              <Badge
                className={
                  planLabel === 'Premium'
                    ? 'bg-amber-100 text-amber-800 border-0'
                    : 'bg-gray-100 text-gray-600 border-0'
                }
              >
                {planLabel}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-gray-400">
              Level {user.level} &middot; {user.xp.toLocaleString()} XP
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {statItems.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-[10px] text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent achievements */}
      {recentAchievements.length > 0 && (
        <div
          className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
            themeConfig.isVA ? 'glass-card' : 'bg-white'
          }`}
        >
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Recent Achievements
          </h3>
          <div className="space-y-2">
            {recentAchievements.map((ua) => (
              <div key={ua.id} className="flex items-center gap-3">
                <span className="text-2xl">{ua.achievement.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {ua.achievement.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(ua.unlockedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected topics */}
      {topicSelections.length > 0 && (
        <div
          className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
            themeConfig.isVA ? 'glass-card' : 'bg-white'
          }`}
        >
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Selected Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {topicSelections.map((ts) => (
              <span
                key={ts.id}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{
                  backgroundColor: themeConfig.topicColors[ts.topic.slug]?.bg ?? '#F3F4F6',
                  color: themeConfig.topicColors[ts.topic.slug]?.text ?? '#374151',
                }}
              >
                {ts.topic.icon} {ts.topic.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Edit profile */}
      <ProfileEditForm currentName={displayName} />
    </div>
  )
}
