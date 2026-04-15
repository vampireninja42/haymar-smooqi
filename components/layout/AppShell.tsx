'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { NavDrawer } from '@/components/layout/NavDrawer'
import { NotificationDrawer, NotificationItem } from '@/components/ui/NotificationDrawer'

interface AppShellProps {
  userName: string
  userImage?: string
  streak: number
  level: number
  notifications?: NotificationItem[]
}

export function AppShell({ userName, userImage, streak, level, notifications = [] }: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  return (
    <>
      <AppHeader
        userName={userName}
        userImage={userImage}
        streak={streak}
        level={level}
        onMenuOpen={() => setIsMenuOpen(true)}
        onNotificationsOpen={() => setIsNotificationsOpen(true)}
      />
      <NavDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userName={userName}
        userImage={userImage}
        level={level}
      />
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
      />
    </>
  )
}
