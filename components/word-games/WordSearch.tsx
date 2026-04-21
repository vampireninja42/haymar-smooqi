'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GameHeader } from './GameHeader'
import { GameSummary } from './GameSummary'

type WordSearchRound = {
  message: string
  conceptWords: string[]
  explanation: string
}

type WordSearchProps = {
  rounds: WordSearchRound[]
}

type Phase = 'playing' | 'feedback' | 'summary'

export function WordSearch({ rounds }: WordSearchProps) {
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<Phase>('playing')
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set())

  const round = rounds[currentRound]
  const conceptWords = round?.conceptWords ?? []

  const toggleWord = useCallback(
    (index: number) => {
      if (phase !== 'playing') return
      setSelectedWords((prev) => {
        const next = new Set(prev)
        if (next.has(index)) {
          next.delete(index)
        } else {
          next.add(index)
        }
        return next
      })
    },
    [phase]
  )

  const handleSubmit = () => {
    const allSelected = selectedWords.size === conceptWords.length
    if (allSelected) {
      setScore((s) => s + 1)
    }
    setPhase('feedback')
  }

  const handleNext = () => {
    if (currentRound + 1 >= rounds.length) {
      setPhase('summary')
    } else {
      setCurrentRound((r) => r + 1)
      setSelectedWords(new Set())
      setPhase('playing')
    }
  }

  const handlePlayAgain = () => {
    setCurrentRound(0)
    setScore(0)
    setSelectedWords(new Set())
    setPhase('playing')
  }

  if (phase === 'summary') {
    return (
      <GameSummary
        score={score}
        totalRounds={rounds.length}
        gameName="Word Search"
        onPlayAgain={handlePlayAgain}
        onBack={() => (window.location.href = '/word-games')}
      />
    )
  }

  return (
    <div className="max-w-[680px] mx-auto">
      <GameHeader
        currentRound={currentRound + 1}
        totalRounds={rounds.length}
        score={score}
      />

      <p className="font-bold text-gray-900 mb-4" style={{ fontSize: '18px' }}>
        Find the key concept words in this message
      </p>

      <div
        className="p-4 rounded-xl border border-gray-200 mb-6"
        style={{ backgroundColor: 'var(--color-primary-light)' }}
      >
        <p className="text-gray-800 text-sm leading-relaxed">{round.message}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {conceptWords.map((word, i) => {
          const isSelected = selectedWords.has(i)

          return (
            <motion.button
              key={`${currentRound}-${i}`}
              onClick={() => toggleWord(i)}
              disabled={phase !== 'playing'}
              whileTap={phase === 'playing' ? { scale: 0.95 } : undefined}
              className={cn(
                'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                phase === 'feedback'
                  ? isSelected
                    ? 'bg-green-100 border-green-400 text-green-800'
                    : 'bg-red-50 border-red-300 text-red-600'
                  : isSelected
                    ? 'border-2 text-white'
                    : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300 cursor-pointer'
              )}
              style={
                isSelected && phase === 'playing'
                  ? {
                      backgroundColor: 'var(--color-primary)',
                      borderColor: 'var(--color-primary)',
                    }
                  : undefined
              }
            >
              {word}
            </motion.button>
          )
        })}
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

      <div className="mt-6 flex justify-center">
        {phase === 'playing' ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedWords.size === 0}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
              borderRadius: 'var(--button-radius)',
            }}
          >
            Submit
          </Button>
        ) : (
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
        )}
      </div>
    </div>
  )
}
