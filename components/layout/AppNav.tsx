'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AppNavProps {
  userName: string
  userImage?: string
  level: number
  streak: number
}

const navItems = [
  { label: 'Home', href: '/home', icon: '\uD83C\uDFE0' },
  { label: 'Explore', href: '/explore', icon: '\uD83D\uDD0D' },
  { label: 'Word Games', href: '/word-games', icon: '\uD83C\uDFAE' },
  { label: 'Leaderboard', href: '/leaderboard', icon: '\uD83C\uDFC6' },
  { label: 'Reports', href: '/reports', icon: '\uD83D\uDCCA' },
  { label: 'Achievements', href: '/achievements', icon: '\uD83C\uDFC5' },
  { label: 'Profile', href: '/profile', icon: '\uD83D\uDC64' },
  { label: 'Settings', href: '/settings', icon: '\u2699\uFE0F' },
]

export function AppNav({ userName, userImage, level, streak }: AppNavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex h-full flex-col shadow-sm" style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)', backdropFilter: 'blur(12px)' }}>
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/home" className="text-2xl font-bold text-[var(--color-primary)]">
          Smooqi
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* User section */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback className="bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 rounded-full bg-[var(--color-primary)] px-1 text-[9px] font-bold text-white leading-tight">
              {level}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-gray-700 truncate">
              {userName}
            </span>
            {streak > 0 && (
              <span className="text-[10px] text-gray-400">
                \uD83D\uDD25 {streak} day streak
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
