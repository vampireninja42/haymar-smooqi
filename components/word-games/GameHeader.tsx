'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { themeConfig } from '@/lib/theme'

type GameHeaderProps = {
  currentRound: number
  totalRounds: number
  score: number
}

export function GameHeader({ currentRound, totalRounds, score: _score }: GameHeaderProps) {
  void _score
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm font-medium text-gray-500">
        Round {currentRound} of {totalRounds}
      </p>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalRounds }).map((_, i) => {
          const completed = i < currentRound - 1
          const current = i === currentRound - 1
          let vAClass = 'border-gray-300 bg-white'
          if (completed) vAClass = 'border-green-500 bg-green-500'
          else if (current) vAClass = 'border-[var(--color-primary)] bg-[var(--color-primary)]'

          let vBStyle: React.CSSProperties = { background: '#FFFFFF', borderColor: '#E8E4DC' }
          if (completed) vBStyle = { background: '#1A6B4A', borderColor: '#1A6B4A' }
          else if (current) vBStyle = { background: '#C6DDD3', borderColor: '#1A6B4A' }

          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ scale: current ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'w-3 h-3 rounded-full border-2 transition-colors',
                themeConfig.isVB ? '' : vAClass
              )}
              style={themeConfig.isVB ? vBStyle : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
