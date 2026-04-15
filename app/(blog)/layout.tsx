import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AppShell } from '@/components/layout/AppShell'
import { prisma } from '@/lib/db'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (session?.user?.id) {
    const userStats = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { level: true, xp: true, currentStreak: true },
    })
    return (
      <div className="app-shell min-h-screen">
        <AppShell
          userName={session.user.name ?? 'User'}
          userImage={session.user.image ?? undefined}
          streak={userStats?.currentStreak ?? 0}
          level={userStats?.level ?? 1}
        />
        <main>
          <div className="pt-20 px-4 py-6 md:px-8 md:py-8 pb-8">
            {children}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
