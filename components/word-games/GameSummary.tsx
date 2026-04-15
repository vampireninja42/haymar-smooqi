'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

type GameSummaryProps = {
  score: number
  totalRounds: number
  gameName: string
  onPlayAgain: () => void
  onBack: () => void
  roundResults?: ('correct' | 'partial' | 'wrong')[]
}

export function GameSummary({ score, totalRounds, gameName, onPlayAgain, onBack, roundResults }: GameSummaryProps) {
  const xpEarned = score * 5
  const pct = Math.round((score / totalRounds) * 100)
  const fullyCorrect = roundResults ? roundResults.filter((r) => r === 'correct').length : score

  useEffect(() => {
    fetch('/api/xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xp: xpEarned, source: gameName }),
    }).catch(() => {})
  }, [xpEarned, gameName])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-sm text-center"
    >
      <h2 className="text-2xl font-bold text-gray-900">Game Over!</h2>
      <p className="mt-2 text-lg text-gray-600">
        {pct >= 80 ? 'Excellent work!' : pct >= 50 ? 'Good effort!' : 'Keep practicing!'}
      </p>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>
          {fullyCorrect} / {totalRounds}
        </p>
        <p className="mt-1 text-sm text-gray-500">rounds fully correct</p>

        <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1">
          <span className="text-sm">+{xpEarned} XP</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3 justify-center">
        <Button variant="outline" onClick={onBack}>
          Back to Games
        </Button>
        <Button
          onClick={onPlayAgain}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
            borderRadius: 'var(--button-radius)',
          }}
        >
          Play Again
        </Button>
      </div>
    </motion.div>
  )
}
