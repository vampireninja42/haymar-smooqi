'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface AchievementDetail {
  name: string
  icon: string
  tier: string
}

export function AchievementToast() {
  const [achievement, setAchievement] = useState<AchievementDetail | null>(null)

  useEffect(() => {
    function handleUnlock(e: Event) {
      const detail = (e as CustomEvent<AchievementDetail>).detail
      setAchievement(detail)
    }

    window.addEventListener('achievement-unlock', handleUnlock)
    return () => window.removeEventListener('achievement-unlock', handleUnlock)
  }, [])

  useEffect(() => {
    if (!achievement) return
    const timer = setTimeout(() => setAchievement(null), 4000)
    return () => clearTimeout(timer)
  }, [achievement])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-xl ring-1 ring-gray-200">
            <span className="text-3xl">{achievement.icon}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">{achievement.name}</p>
              <Badge variant="secondary" className="mt-0.5 text-xs capitalize">
                {achievement.tier}
              </Badge>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
