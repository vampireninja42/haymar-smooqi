'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export interface NotificationItem {
  id: string
  icon: string
  text: string
  timeAgo: string
}

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
  notifications: NotificationItem[]
}

export function NotificationDrawer({ isOpen, onClose, notifications }: NotificationDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/30"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-0 right-0 z-50 flex h-full w-[320px] flex-col bg-white shadow-xl"
          >
            <div className="flex h-14 items-center justify-between border-b border-gray-100 px-5">
              <h2 className="text-base font-bold text-gray-900">Notifications</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-3xl">{'\uD83C\uDF89'}</p>
                  <p className="mt-3 text-sm font-medium text-gray-900">All caught up!</p>
                  <p className="mt-1 text-xs text-gray-500">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex items-start gap-3 px-5 py-3.5">
                      <span className="text-xl flex-shrink-0">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">{n.text}</p>
                        <p className="mt-0.5 text-[11px] text-gray-400">{n.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
