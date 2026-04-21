'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { themeConfig } from '@/lib/theme'

type GameSummaryProps = {
  score: number
  totalRounds: number
  gameName: string
  correctRounds?: number
  onPlayAgain: () => void
  onBack: () => void
}

export function GameSummary({
  score,
  totalRounds,
  gameName,
  correctRounds,
  onPlayAgain,
  onBack,
}: GameSummaryProps) {
  const xpEarned = score * 5
  const hasSent = useRef(false)
  const [newAchievements, setNewAchievements] = useState<Array<{ id: string; name: string; icon: string }>>([])

  useEffect(() => {
    if (score > 0 && !hasSent.current) {
      hasSent.current = true
      fetch('/api/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: xpEarned, source: gameName }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data?.newAchievements) && data.newAchievements.length > 0) {
            setNewAchievements(data.newAchievements)
            data.newAchievements.forEach((a: { id: string }, i: number) => {
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('achievement-unlock', { detail: a }))
              }, i * 1200)
            })
          }
        })
        .catch(() => {})
    }
  }, [score, xpEarned, gameName])

  const percentage = Math.round((score / totalRounds) * 100)

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center text-center py-12 px-6"
    >
      <p
        className="text-5xl font-bold mb-2"
        style={
          themeConfig.isVB
            ? { color: '#1C1917', fontFamily: 'var(--font-playfair)' }
            : { color: '#111827' }
        }
      >
        {score} / {totalRounds}
      </p>

      {correctRounds !== undefined && (
        <p className="text-sm text-gray-500 mt-1">
          {correctRounds} / {totalRounds} rounds fully correct
        </p>
      )}

      <p className="text-lg text-gray-600 mb-4">
        {percentage >= 80
          ? 'Excellent work!'
          : percentage >= 60
            ? 'Nice effort!'
            : 'Keep practicing!'}
      </p>

      {xpEarned > 0 && (
        <Badge
          className="text-lg px-4 py-1.5 mb-8"
          style={
            themeConfig.isVB
              ? {
                  backgroundColor: '#EAF4EF',
                  color: '#1A6B4A',
                  border: 'none',
                }
              : {
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  border: 'none',
                }
          }
        >
          +{xpEarned} XP
        </Badge>
      )}

      {xpEarned === 0 && <div className="mb-8" />}

      {newAchievements.length > 0 && (
        <div className="w-full max-w-xs mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            New Achievement{newAchievements.length > 1 ? 's' : ''}
          </p>
          {newAchievements.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-sm font-medium text-gray-900">{a.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          onClick={onPlayAgain}
          className="w-full"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
            borderRadius: 'var(--button-radius)',
          }}
        >
          Play Again
        </Button>
        <Button variant="ghost" onClick={onBack} className="w-full">
          Back to Games
        </Button>
      </div>
    </motion.div>
  )
}
