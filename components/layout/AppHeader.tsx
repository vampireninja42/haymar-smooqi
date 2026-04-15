'use client'

import Link from 'next/link'
import { Menu, Bell } from 'lucide-react'
import { SmooqiLogo } from '@/components/ui/SmooqiLogo'

interface AppHeaderProps {
  userName: string
  userImage?: string
  streak: number
  level: number
  onMenuOpen: () => void
  onNotificationsOpen: () => void
}

export function AppHeader({ streak, level, onMenuOpen, onNotificationsOpen }: AppHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex h-14 md:h-16 items-center justify-between px-4 md:px-6 border-b border-gray-100 shadow-sm"
      style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <Link href="/home">
        <SmooqiLogo size="small" />
      </Link>

      <div className="flex items-center gap-2">
        {streak > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            🔥 {streak}
          </span>
        )}
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
          Lvl {level}
        </span>
        <button
          onClick={onNotificationsOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          onClick={onMenuOpen}
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
