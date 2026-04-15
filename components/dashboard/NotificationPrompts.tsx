'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

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
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <button
              onClick={handleEnableNotifications}
              className="flex flex-1 items-start gap-3 cursor-pointer text-left"
            >
              <span className="text-lg">&#128276;</span>
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Enable notifications
                </p>
                <p className="text-xs text-amber-700">
                  Get daily reminders to keep your streak alive and never miss a
                  challenge.
                </p>
              </div>
            </button>
            <button
              onClick={dismissNotificationPrompt}
              className="flex-shrink-0 text-amber-400 hover:text-amber-600"
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
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Link
              href="/support"
              className="flex flex-1 items-start gap-3 cursor-pointer"
            >
              <span className="text-lg">&#11088;</span>
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Enjoying Smooqi?
                </p>
                <p className="text-xs text-amber-700">
                  You&apos;ve completed {totalLessonsDone} lessons! If you&apos;re
                  enjoying the app, we&apos;d love your feedback.
                </p>
              </div>
            </Link>
            <button
              onClick={dismissRatingPrompt}
              className="flex-shrink-0 text-amber-400 hover:text-amber-600"
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
