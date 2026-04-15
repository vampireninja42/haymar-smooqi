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

type RoundResult = 'correct' | 'partial' | 'wrong'

export function WordHunter({ rounds }: WordHunterProps) {
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<Phase>('playing')
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set())
  const [roundResults, setRoundResults] = useState<RoundResult[]>([])
  const [roundStats, setRoundStats] = useState({ correct: 0, wrong: 0, missed: 0 })

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

    let correctCount = 0
    let wrongCount = 0
    let missedCount = 0

    // Count correct and wrong selections
    selectedWords.forEach((i) => {
      const wordClean = words[i].replace(/[.,!?;:]/g, '').toLowerCase()
      if (redundantSet.has(wordClean)) {
        correctCount++
      } else {
        wrongCount++
      }
    })

    // Count missed redundant words
    words.forEach((word, i) => {
      const wordClean = word.replace(/[.,!?;:]/g, '').toLowerCase()
      if (redundantSet.has(wordClean) && !selectedWords.has(i)) {
        missedCount++
      }
    })

    setRoundStats({ correct: correctCount, wrong: wrongCount, missed: missedCount })

    // Determine round result
    let result: RoundResult
    if (correctCount === redundantSet.size && wrongCount === 0) {
      result = 'correct'
      setScore((s) => s + 1)
    } else if (correctCount > 0) {
      result = 'partial'
    } else {
      result = 'wrong'
    }
    setRoundResults((prev) => [...prev, result])

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
    setRoundResults([])
    setRoundStats({ correct: 0, wrong: 0, missed: 0 })
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
        roundResults={roundResults}
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
        return 'border-green-400 text-green-800'
      }
      if (isSelected && !isRedundant) {
        return 'border-red-400 text-red-800'
      }
      if (!isSelected && isRedundant) {
        return 'border-amber-400 text-amber-700'
      }
      return 'bg-white border-gray-200 text-gray-700'
    }

    if (isSelected) {
      return 'border-2 text-white'
    }

    return 'bg-white border-gray-200 text-gray-800 hover:border-gray-300 cursor-pointer'
  }

  const getChipBg = (index: number) => {
    const wordClean = words[index].replace(/[.,!?;:]/g, '').toLowerCase()
    const isSelected = selectedWords.has(index)
    const isRedundant = redundantSet.has(wordClean)

    if (phase === 'feedback') {
      if (isSelected && isRedundant) return '#DCFCE7'
      if (isSelected && !isRedundant) return '#FEE2E2'
      if (!isSelected && isRedundant) return '#FEF9C3'
    }

    return undefined
  }

  const getChipIcon = (index: number) => {
    if (phase !== 'feedback') return null
    const wordClean = words[index].replace(/[.,!?;:]/g, '').toLowerCase()
    const isSelected = selectedWords.has(index)
    const isRedundant = redundantSet.has(wordClean)

    if (isSelected && isRedundant) return '\u2713'
    if (isSelected && !isRedundant) return '\u2717'
    if (!isSelected && isRedundant) return 'missed'
    return null
  }

  return (
    <div className="max-w-[680px] mx-auto">
      <GameHeader
        currentRound={currentRound + 1}
        totalRounds={rounds.length}
        score={score}
      />

      <p className="font-bold text-gray-900 mb-1" style={{ fontSize: '18px' }}>
        Tap the redundant words in this sentence
      </p>
      <p className="text-sm text-gray-500 mb-2">
        Find words or phrases that unnecessarily repeat the same meaning.
      </p>

      {currentRound === 0 && phase === 'playing' && (
        <div className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          <span className="font-semibold">Example:</span> &quot;Please revert back&quot; — &lsquo;back&rsquo; is redundant because &lsquo;revert&rsquo; already means &lsquo;go back&rsquo;.
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {words.map((word, i) => {
          const icon = getChipIcon(i)
          return (
            <motion.button
              key={`${currentRound}-${i}`}
              onClick={() => toggleWord(i)}
              disabled={phase !== 'playing'}
              whileTap={phase === 'playing' ? { scale: 0.95 } : undefined}
              className={cn(
                'px-3 py-2 rounded-lg border text-sm font-medium transition-all inline-flex items-center gap-1',
                getChipStyle(i)
              )}
              style={
                selectedWords.has(i) && phase === 'playing'
                  ? {
                      backgroundColor: 'var(--color-primary)',
                      borderColor: 'var(--color-primary)',
                    }
                  : phase === 'feedback'
                    ? { backgroundColor: getChipBg(i) }
                    : undefined
              }
            >
              {icon && <span className="text-xs font-bold">{icon}</span>}
              {word}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {phase === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Score banner */}
            <div className="mt-4 flex items-center gap-4 text-sm font-medium">
              <span className="text-green-700">{'\u2713'} {roundStats.correct} correct</span>
              <span className="text-red-700">{'\u2717'} {roundStats.wrong} wrong</span>
              <span className="text-amber-700">{'\u26A0'} {roundStats.missed} missed</span>
            </div>

            {round.explanation && (
              <div className="mt-3 p-4 bg-blue-50 rounded-xl text-sm text-gray-700">
                <span className="font-semibold">Explanation: </span>
                {round.explanation}
              </div>
            )}
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
