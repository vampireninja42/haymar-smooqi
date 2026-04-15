'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GameHeader } from './GameHeader'
import { GameSummary } from './GameSummary'

type CommSenseRound = {
  optionA: string
  optionB: string
  effectiveOption: 'A' | 'B'
  explanation: string
}

type CommSenseProps = {
  rounds: CommSenseRound[]
}

type Phase = 'playing' | 'feedback' | 'summary'

export function CommSense({ rounds }: CommSenseProps) {
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<Phase>('playing')
  const [selected, setSelected] = useState<'A' | 'B' | null>(null)

  const round = rounds[currentRound]

  const handleSelect = useCallback(
    (option: 'A' | 'B') => {
      if (phase !== 'playing') return
      setSelected(option)
      if (option === round.effectiveOption) {
        setScore((s) => s + 1)
      }
      setPhase('feedback')
    },
    [phase, round?.effectiveOption]
  )

  const handleNext = () => {
    if (currentRound + 1 >= rounds.length) {
      setPhase('summary')
    } else {
      setCurrentRound((r) => r + 1)
      setSelected(null)
      setPhase('playing')
    }
  }

  const handlePlayAgain = () => {
    setCurrentRound(0)
    setScore(0)
    setSelected(null)
    setPhase('playing')
  }

  if (phase === 'summary') {
    return (
      <GameSummary
        score={score}
        totalRounds={rounds.length}
        gameName="Communication Sense"
        onPlayAgain={handlePlayAgain}
        onBack={() => (window.location.href = '/word-games')}
      />
    )
  }

  const getCardStyle = (option: 'A' | 'B') => {
    if (phase === 'playing') {
      return 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md cursor-pointer'
    }

    const isCorrect = option === round.effectiveOption

    if (isCorrect) {
      return 'bg-green-50 border-2 border-green-400'
    }

    if (option === selected && !isCorrect) {
      return 'bg-red-50 border-2 border-red-400'
    }

    return 'bg-white border-gray-200 opacity-60'
  }

  return (
    <div className="max-w-[680px] mx-auto">
      <GameHeader
        currentRound={currentRound + 1}
        totalRounds={rounds.length}
        score={score}
      />

      <p className="font-bold text-gray-900 mb-6" style={{ fontSize: '18px' }}>
        Which response is more effective?
      </p>

      <div className="flex flex-col gap-4">
        {(['A', 'B'] as const).map((option) => (
          <motion.button
            key={`${currentRound}-${option}`}
            onClick={() => handleSelect(option)}
            disabled={phase !== 'playing'}
            whileTap={phase === 'playing' ? { scale: 0.98 } : undefined}
            className={cn(
              'w-full text-left p-5 rounded-xl border transition-all',
              getCardStyle(option)
            )}
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                {option}
              </span>
              <span className="flex-1 text-gray-800 text-sm leading-relaxed">
                {option === 'A' ? round.optionA : round.optionB}
              </span>
              {phase === 'feedback' && option === round.effectiveOption && (
                <span className="text-lg flex-shrink-0">&#x2705;</span>
              )}
              {phase === 'feedback' &&
                option === selected &&
                option !== round.effectiveOption && (
                  <span className="text-lg flex-shrink-0">&#x274C;</span>
                )}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {phase === 'feedback' && round.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-gray-700">
              <span className="font-semibold">Explanation: </span>
              {round.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'feedback' && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleNext}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
              borderRadius: 'var(--button-radius)',
            }}
          >
            {currentRound + 1 >= rounds.length ? 'See Results' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  )
}
