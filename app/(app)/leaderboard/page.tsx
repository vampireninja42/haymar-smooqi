import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getLevelFromXp } from '@/lib/xp'
import { themeConfig } from '@/lib/theme'
import { LeaderboardTabs } from './LeaderboardTabs'

export const dynamic = 'force-dynamic'

type TabValue = 'week' | 'month' | 'all'

const MEDALS = ['🥇', '🥈', '🥉'] as const

function getMonday(): Date {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function getFirstOfMonth(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const userId = session.user.id

  const params = await searchParams
  const tab = (['week', 'month', 'all'].includes(params.tab ?? '')
    ? params.tab
    : 'week') as TabValue

  let leaderboard: Array<{
    id: string
    name: string | null
    image: string | null
    xp: number
    level: number
  }> = []

  if (tab === 'week' || tab === 'month') {
    const since = tab === 'week' ? getMonday() : getFirstOfMonth()
    const grouped = await prisma.userXPLog.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: since } },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 50,
    })

    const userIds = grouped.map((g) => g.userId)
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, image: true, xp: true },
    })
    const userMap = new Map(users.map((u) => [u.id, u]))

    leaderboard = grouped
      .map((g) => {
        const u = userMap.get(g.userId)
        if (!u) return null
        return {
          id: u.id,
          name: u.name,
          image: u.image,
          xp: g._sum.amount ?? 0,
          level: getLevelFromXp(u.xp),
        }
      })
      .filter(Boolean) as typeof leaderboard
  } else {
    const users = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 50,
      select: { id: true, name: true, image: true, xp: true },
    })
    leaderboard = users.map((u) => ({
      id: u.id,
      name: u.name,
      image: u.image,
      xp: u.xp,
      level: getLevelFromXp(u.xp),
    }))
  }

  const currentUserRank = leaderboard.findIndex((u) => u.id === userId)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>

      <LeaderboardTabs activeTab={tab} />

      <div
        className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
          themeConfig.isVA ? 'glass-card' : 'bg-white'
        }`}
      >
        {leaderboard.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No activity yet for this period. Start learning to climb the ranks!
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {leaderboard.map((user, i) => {
              const isCurrentUser = user.id === userId
              const rank = i + 1

              return (
                <li
                  key={user.id}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isCurrentUser
                      ? 'bg-[var(--color-primary-light)] ring-1 ring-[var(--color-primary)]/20'
                      : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="flex w-8 items-center justify-center flex-shrink-0">
                    {rank <= 3 ? (
                      <span className="text-xl">{MEDALS[rank - 1]}</span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-400">
                        {rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      backgroundColor: isCurrentUser
                        ? 'var(--color-primary)'
                        : '#9CA3AF',
                    }}
                  >
                    {(user.name ?? 'U').charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name ?? 'Anonymous'}
                      </p>
                      {isCurrentUser && (
                        <span className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold text-white">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Level {user.level}</p>
                  </div>

                  {/* XP */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {user.xp.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400">XP</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {currentUserRank === -1 && leaderboard.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-center text-xs text-gray-500">
              Keep learning to make it to the top 50!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
