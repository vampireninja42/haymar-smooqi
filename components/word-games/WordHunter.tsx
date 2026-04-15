'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GameHeader } from './GameHeader'
import { GameSummary } from './GameSummary'

type WordHunterRound = {
  sentence: string
  redundantWords: string[]
  explanation: string
}

type WordHunterProps = {
  rounds: WordHunterRound[]
}

type Phase = 'playing' | 'feedback' | 'summary'

export function WordHunter({ rounds }: WordHunterProps) {
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<Phase>('playing')
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set())

  const round = rounds[currentRound]
  const words = round?.sentence.split(/\s+/) ?? []

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
    const redundantSet = new Set(
      round.redundantWords.map((w) => w.toLowerCase())
    )
    const selectedTexts = Array.from(selectedWords).map((i) =>
      words[i].replace(/[.,!?;:]/g, '').toLowerCase()
    )

    const correctSelections = selectedTexts.filter((w) => redundantSet.has(w))
    const isCorrect =
      correctSelections.length === redundantSet.size &&
      selectedTexts.length === redundantSet.size

    if (isCorrect) {
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
        gameName="Word Hunter"
        onPlayAgain={handlePlayAgain}
        onBack={() => (window.location.href = '/word-games')}
      />
    )
  }

  const redundantSet = new Set(
    round.redundantWords.map((w) => w.toLowerCase())
  )

  const getChipStyle = (index: number) => {
    const wordClean = words[index].replace(/[.,!?;:]/g, '').toLowerCase()
    const isSelected = selectedWords.has(index)
    const isRedundant = redundantSet.has(wordClean)

    if (phase === 'feedback') {
      if (isSelected && isRedundant) {
        return 'bg-green-100 border-green-400 text-green-800'
      }
      if (isSelected && !isRedundant) {
        return 'bg-red-100 border-red-400 text-red-800'
      }
      if (!isSelected && isRedundant) {
        return 'bg-amber-50 border-amber-300 text-amber-700 animate-pulse'
      }
      return 'bg-white border-gray-200 text-gray-700'
    }

    if (isSelected) {
      return 'border-2 text-white'
    }

    return 'bg-white border-gray-200 text-gray-800 hover:border-gray-300 cursor-pointer'
  }

  return (
    <div className="max-w-[680px] mx-auto">
      <GameHeader
        currentRound={currentRound + 1}
        totalRounds={rounds.length}
        score={score}
      />

      <p className="font-bold text-gray-900 mb-2" style={{ fontSize: '18px' }}>
        Tap the redundant words in this sentence
      </p>

      <div className="flex flex-wrap gap-2 mt-6">
        {words.map((word, i) => (
          <motion.button
            key={`${currentRound}-${i}`}
            onClick={() => toggleWord(i)}
            disabled={phase !== 'playing'}
            whileTap={phase === 'playing' ? { scale: 0.95 } : undefined}
            className={cn(
              'px-3 py-2 rounded-lg border text-sm font-medium transition-all',
              getChipStyle(i)
            )}
            style={
              selectedWords.has(i) && phase === 'playing'
                ? {
                    backgroundColor: 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                  }
                : undefined
            }
          >
            {word}
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
