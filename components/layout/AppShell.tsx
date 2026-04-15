'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { NavDrawer } from '@/components/layout/NavDrawer'
import type { NotificationItem } from '@/components/ui/NotificationDrawer'

interface AppShellProps {
  userName: string
  userImage?: string
  streak: number
  level: number
  notifications?: NotificationItem[]
}

export function AppShell({ userName, userImage, streak, level, notifications = [] }: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <AppHeader
        userName={userName}
        userImage={userImage}
        streak={streak}
        level={level}
        notifications={notifications}
        onMenuOpen={() => setIsMenuOpen(true)}
      />
      <NavDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userName={userName}
        userImage={userImage}
        level={level}
      />
    </>
  )
}
