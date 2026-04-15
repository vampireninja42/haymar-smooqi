'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type GameSummaryProps = {
  score: number
  totalRounds: number
  gameName: string
  onPlayAgain: () => void
  onBack: () => void
}

export function GameSummary({
  score,
  totalRounds,
  gameName,
  onPlayAgain,
  onBack,
}: GameSummaryProps) {
  const xpEarned = score * 5
  const hasSent = useRef(false)

  useEffect(() => {
    if (score > 0 && !hasSent.current) {
      hasSent.current = true
      fetch('/api/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: xpEarned, source: gameName }),
      })
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
      <p className="text-5xl font-bold text-gray-900 mb-2">
        {score} / {totalRounds}
      </p>

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
          style={{
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            border: 'none',
          }}
        >
          +{xpEarned} XP
        </Badge>
      )}

      {xpEarned === 0 && <div className="mb-8" />}

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
