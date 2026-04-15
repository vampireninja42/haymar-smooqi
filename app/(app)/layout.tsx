import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AppNav } from '@/components/layout/AppNav'
import { MobileNav } from '@/components/layout/MobileNav'
import { LevelUpToast } from '@/components/ui/LevelUpToast'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const userId = session.user?.id
  const userStats = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { level: true, xp: true, currentStreak: true },
      })
    : null

  const user = {
    name: session.user?.name ?? 'User',
    image: session.user?.image ?? undefined,
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--app-background, transparent)' }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col">
        <AppNav
          userName={user.name}
          userImage={user.image}
          level={userStats?.level ?? 1}
          streak={userStats?.currentStreak ?? 0}
        />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden">
        <MobileNav
          userName={user.name}
          userImage={user.image}
          level={userStats?.level ?? 1}
          streak={userStats?.currentStreak ?? 0}
          xp={userStats?.xp ?? 0}
        />
      </div>

      {/* Main content */}
      <main className="md:pl-60">
        <div className="px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* Level up celebration toast */}
      <LevelUpToast />

      {/* Mobile bottom tab bar is rendered inside MobileNav as fixed bottom */}
    </div>
  )
}
