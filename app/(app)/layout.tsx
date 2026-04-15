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

      {/* Decorative background dots (vA only) */}
      <div className="bg-dots fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <span style={{ width: 8, height: 8, background: '#7C3AED', opacity: 0.35, top: '15%', left: '8%' }} />
        <span style={{ width: 6, height: 6, background: '#0EA5E9', opacity: 0.3, top: '40%', right: '12%' }} />
        <span style={{ width: 10, height: 10, background: '#10B981', opacity: 0.25, bottom: '25%', left: '15%' }} />
        <span style={{ width: 7, height: 7, background: '#F472B6', opacity: 0.3, top: '70%', right: '20%' }} />
        <span style={{ width: 6, height: 6, background: '#A78BFA', opacity: 0.4, top: '10%', right: '30%' }} />
      </div>

      {/* Main content */}
      <main className="relative z-10">
        <div className="pt-20 px-4 py-6 md:px-8 md:pt-20 md:pb-8 pb-8">
          {children}
        </div>
      </main>

      {/* Level up celebration toast */}
      <LevelUpToast />
    </div>
  )
}
