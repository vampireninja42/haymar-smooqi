import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AppShell } from '@/components/layout/AppShell'
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
    <div className="app-shell min-h-screen">
      <AppShell
        userName={user.name}
        userImage={user.image}
        streak={userStats?.currentStreak ?? 0}
        level={userStats?.level ?? 1}
      />

      {/* Main content */}
      <main>
        <div className="pt-16 px-4 py-6 md:px-8 md:py-8 pb-8">
          {children}
        </div>
      </main>

      {/* Level up celebration toast */}
      <LevelUpToast />
    </div>
  )
}
