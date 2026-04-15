'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { themeConfig } from '@/lib/theme'

interface NotificationPromptsProps {
  notificationsEnabled: boolean
  totalLessonsDone: number
}

const STORAGE_KEY_NOTIFICATIONS = 'smooqi_prompt_dismissed_notifications'
const STORAGE_KEY_RATING = 'smooqi_prompt_dismissed_rating'

export function NotificationPrompts({
  notificationsEnabled,
  totalLessonsDone,
}: NotificationPromptsProps) {
  const [dismissedNotifications, setDismissedNotifications] = useState(true)
  const [dismissedRating, setDismissedRating] = useState(true)

  useEffect(() => {
    setDismissedNotifications(
      localStorage.getItem(STORAGE_KEY_NOTIFICATIONS) === 'true'
    )
    setDismissedRating(localStorage.getItem(STORAGE_KEY_RATING) === 'true')
  }, [])

  const showNotification = !notificationsEnabled && !dismissedNotifications
  const showRating = totalLessonsDone >= 3 && !dismissedRating

  function dismissNotificationPrompt() {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, 'true')
    setDismissedNotifications(true)
  }

  function dismissRatingPrompt() {
    localStorage.setItem(STORAGE_KEY_RATING, 'true')
    setDismissedRating(true)
  }

  async function handleEnableNotifications() {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        await fetch('/api/user/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationsEnabled: true }),
        })
        dismissNotificationPrompt()
      }
    } catch {
      // Permission denied or error — just dismiss
    }
  }

  const cardClass = themeConfig.isVA ? 'glass-card' : 'bg-white shadow-sm'

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          key="notification-prompt"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className={`relative rounded-xl p-4 ${cardClass}`}>
            {/* Dismiss X */}
            <button
              onClick={dismissNotificationPrompt}
              className="absolute top-3 right-3 text-gray-300 hover:text-gray-500"
              aria-label="Dismiss"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

            <div className="flex items-start gap-3">
              {/* Icon badge */}
              <span
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white text-lg"
                style={{
                  background:
                    'linear-gradient(135deg, #f59e0b, #fbbf24)',
                }}
              >
                \uD83D\uDD14
              </span>
              <div className="flex-1 pr-6">
                <p className="text-sm font-bold text-gray-900">
                  Stay on track!
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Get daily reminders to keep your streak alive and never miss a
                  challenge.
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={handleEnableNotifications}
                className="rounded-[var(--button-radius)] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                Enable Reminders
              </button>
              <button
                onClick={dismissNotificationPrompt}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Not now
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {showRating && (
        <motion.div
          key="rating-prompt"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className={`relative rounded-xl p-4 ${cardClass}`}>
            {/* Dismiss X */}
            <button
              onClick={dismissRatingPrompt}
              className="absolute top-3 right-3 text-gray-300 hover:text-gray-500"
              aria-label="Dismiss"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

            <div className="flex items-start gap-3">
              {/* Icon badge */}
              <span
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white text-lg"
                style={{
                  background:
                    'linear-gradient(135deg, #14b8a6, #8b5cf6)',
                }}
              >
                \uD83D\uDCAC
              </span>
              <div className="flex-1 pr-6">
                <p className="text-sm font-bold text-gray-900">
                  How are you liking Smooqi?
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  You&apos;ve completed {totalLessonsDone} lessons! We&apos;d
                  love your feedback.
                </p>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <Link
                href="/support"
                className="rounded-[var(--button-radius)] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                Rate Us
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
