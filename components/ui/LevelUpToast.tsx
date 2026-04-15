'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LevelUpDetail {
  level: number
}

export function LevelUpToast() {
  const [level, setLevel] = useState<number | null>(null)

  useEffect(() => {
    function handleLevelUp(e: Event) {
      const detail = (e as CustomEvent<LevelUpDetail>).detail
      setLevel(detail.level)
    }

    window.addEventListener('level-up', handleLevelUp)
    return () => window.removeEventListener('level-up', handleLevelUp)
  }, [])

  useEffect(() => {
    if (level === null) return
    const timer = setTimeout(() => setLevel(null), 3000)
    return () => clearTimeout(timer)
  }, [level])

  return (
    <AnimatePresence>
      {level !== null && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center"
          >
            <div className="rounded-2xl bg-[var(--color-primary)] px-8 py-6 text-center text-white shadow-2xl">
              <p className="text-3xl">&#127881;</p>
              <p className="mt-2 text-lg font-bold">Level Up!</p>
              <p className="text-sm opacity-90">
                You reached Level {level}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
