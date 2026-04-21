'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GameHeader } from './GameHeader'
import { GameSummary } from './GameSummary'

type Round = {
  sentence: string
  options: [string, string, string, string]
  correctIndex: number
  explanation: string
}

type Props = {
  rounds: Round[]
}

type Phase = 'playing' | 'feedback' | 'summary'

const LETTERS = ['A', 'B', 'C', 'D'] as const

export function FillBlank({ rounds }: Props) {
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<Phase>('playing')
  const [selected, setSelected] = useState<number | null>(null)

  const round = rounds[currentRound]

  const handleSelect = useCallback(
    (index: number) => {
      if (phase !== 'playing') return
      setSelected(index)
      if (index === round.correctIndex) {
        setScore((s) => s + 1)
      }
      setPhase('feedback')
    },
    [phase, round?.correctIndex]
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
        gameName="Fill the Blank"
        onPlayAgain={handlePlayAgain}
        onBack={() => (window.location.href = '/word-games')}
      />
    )
  }

  const getCardStyle = (index: number) => {
    if (phase === 'playing') {
      return 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md cursor-pointer'
    }
    const isCorrect = index === round.correctIndex
    if (isCorrect) return 'bg-green-50 border-2 border-green-400'
    if (index === selected && !isCorrect) return 'bg-red-50 border-2 border-red-400'
    return 'bg-white border-gray-200 opacity-60'
  }

  const sentenceParts = round.sentence.split('___')

  return (
    <div className="max-w-[680px] mx-auto">
      <GameHeader
        currentRound={currentRound + 1}
        totalRounds={rounds.length}
        score={score}
      />

      <p className="font-bold text-gray-900 mb-6" style={{ fontSize: '18px' }}>
        Fill in the blank:
      </p>

      <div className="mb-6 p-5 bg-white rounded-xl border border-gray-200 text-gray-800 leading-relaxed">
        {sentenceParts.map((part, i) => (
          <span key={i}>
            {part}
            {i < sentenceParts.length - 1 && (
              <span
                className="font-bold px-1"
                style={{ color: 'var(--color-primary)' }}
              >
                ___
              </span>
            )}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {round.options.map((option, index) => (
          <motion.button
            key={`${currentRound}-${index}`}
            onClick={() => handleSelect(index)}
            disabled={phase !== 'playing'}
            whileTap={phase === 'playing' ? { scale: 0.98 } : undefined}
            className={cn(
              'w-full text-center p-4 rounded-xl border transition-all',
              getCardStyle(index)
            )}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                {LETTERS[index]}
              </span>
              <span className="text-gray-800 text-sm leading-relaxed">
                {option}
              </span>
              {phase === 'feedback' && index === round.correctIndex && (
                <span className="text-lg">&#x2705;</span>
              )}
              {phase === 'feedback' &&
                index === selected &&
                index !== round.correctIndex && (
                  <span className="text-lg">&#x274C;</span>
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
