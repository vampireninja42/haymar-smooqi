'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { themeConfig } from '@/lib/theme'

interface NavDrawerProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  userImage?: string
  level: number
}

const navItems = [
  { label: 'Home', href: '/home', icon: '🏠' },
  { label: 'Explore', href: '/explore', icon: '🔍' },
  { label: 'Word Games', href: '/word-games', icon: '🎮' },
  { label: 'Leaderboard', href: '/leaderboard', icon: '🏆' },
  { label: 'Reports', href: '/reports', icon: '📊' },
  { label: 'Achievements', href: '/achievements', icon: '🏅' },
  { label: 'Profile', href: '/profile', icon: '👤' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
]

const secondaryNavItems = [
  { label: 'Blog', href: '/blog', icon: '📝' },
  { label: 'Support', href: '/support', icon: '🆘' },
  { label: 'About', href: '/about-smooqi', icon: 'ℹ️' },
]

export function NavDrawer({ isOpen, onClose, userName, userImage, level }: NavDrawerProps) {
  const pathname = usePathname()
  const drawerBg = themeConfig.isVA ? '#FFFFFF' : '#FAFAF7'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-black/30"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: 280 }}
            animate={{ x: 0 }}
            exit={{ x: 280 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-0 right-0 z-50 flex h-full w-[280px] flex-col shadow-xl"
            style={{ background: drawerBg, backgroundColor: drawerBg }}
          >
            {/* Close button */}
            <div className="flex h-14 items-center justify-end px-4">
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User info */}
            <div className="flex items-center gap-3 px-5 pb-5 border-b border-gray-100">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback className="bg-[var(--color-primary-light)] text-[var(--color-primary)] text-sm font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                <span className="inline-flex items-center rounded-full bg-[var(--color-primary-light)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-primary)]">
                  Level {level}
                </span>
              </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
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

              {/* Divider */}
              <div className="mx-1 my-2 border-t border-gray-100" />
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">More</p>

              {/* Secondary nav items */}
              {secondaryNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
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
            </nav>

            {/* Sign out */}
            <div className="border-t border-gray-100 p-4">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                Sign out
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
