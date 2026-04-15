'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { NavDrawer } from '@/components/layout/NavDrawer'

interface AppShellProps {
  userName: string
  userImage?: string
  streak: number
  level: number
}

export function AppShell({ userName, userImage, streak, level }: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <AppHeader
        userName={userName}
        userImage={userImage}
        streak={streak}
        level={level}
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
