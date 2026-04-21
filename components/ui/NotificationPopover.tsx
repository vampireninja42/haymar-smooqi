'use client'
import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { NotificationItem } from './NotificationDrawer'

interface NotificationPopoverProps {
  notifications: NotificationItem[]
}

export function NotificationPopover({ notifications }: NotificationPopoverProps) {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasReferral = notifications.some((n) => n.id === 'referral')
  const capped = notifications.slice(0, 4)
  const showDot = notifications.length > 0 && !dismissed

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open) {
      setDismissed(true)
      if (hasReferral) {
        fetch('/api/user/notifications/clear-referral', { method: 'POST' }).catch(() => {})
      }
    }
  }, [open, hasReferral])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {showDot && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="notification-popover absolute right-0 top-full mt-2 w-64 rounded-xl bg-white shadow-xl border border-gray-100 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-900">Notifications</p>
              <button onClick={() => setOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">
                Close
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto">
              {capped.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-2xl mb-2">{'\uD83C\uDF89'}</p>
                  <p className="text-sm font-medium text-gray-900">All caught up!</p>
                  <p className="text-xs text-gray-400 mt-1">No new notifications</p>
                </div>
              ) : (
                capped.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <span className="text-xl flex-shrink-0">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.timeAgo}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
