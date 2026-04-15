'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface MobileNavProps {
  userName: string
  userImage?: string
  level: number
  streak: number
  xp: number
}

const bottomTabs = [
  { label: 'Home', href: '/home', icon: '\uD83C\uDFE0' },
  { label: 'Explore', href: '/explore', icon: '\uD83D\uDD0D' },
  { label: 'Games', href: '/word-games', icon: '\uD83C\uDFAE' },
  { label: 'Ranks', href: '/leaderboard', icon: '\uD83C\uDFC6' },
  { label: 'Profile', href: '/profile', icon: '\uD83D\uDC64' },
]

export function MobileNav({ level, streak, xp }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Top header bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between px-4 shadow-sm border-b" style={{ background: 'var(--sidebar-bg, #fff)', borderColor: 'var(--sidebar-border, #f3f4f6)' }}>
        <Link href="/home" className="text-xl font-bold text-[var(--color-primary)]">
          Smooqi
        </Link>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <Badge variant="secondary" className="text-xs font-medium">
              \uD83D\uDD25 {streak}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs font-medium">
            Lvl {level}
          </Badge>
          <Badge variant="secondary" className="text-xs font-medium">
            {xp} XP
          </Badge>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t pb-[env(safe-area-inset-bottom)]" style={{ background: 'var(--sidebar-bg, #fff)', borderColor: 'var(--sidebar-border, #e5e7eb)' }}>
        {bottomTabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors',
                isActive
                  ? 'text-[var(--color-primary)] font-semibold'
                  : 'text-gray-400'
              )}
            >
              <span className={cn('text-xl', isActive && 'scale-110 transition-transform')}>
                {tab.icon}
              </span>
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
