'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type GameHeaderProps = {
  currentRound: number
  totalRounds: number
  score: number
}

export function GameHeader({ currentRound, totalRounds, score }: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm font-medium text-gray-500">
        Round {currentRound} of {totalRounds}
      </p>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              scale: i < score ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              'w-3 h-3 rounded-full border-2 transition-colors',
              i < score
                ? 'border-green-500 bg-green-500'
                : 'border-gray-300 bg-white'
            )}
          />
        ))}
      </div>
    </div>
  )
}
