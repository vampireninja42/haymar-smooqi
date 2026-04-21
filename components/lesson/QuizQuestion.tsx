'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { themeConfig } from '@/lib/theme'

type QuizQuestionProps = {
  question: {
    question: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctAnswer: string
    explanation?: string | null
  }
  questionNumber: number
  totalQuestions: number
  onAnswer: (isCorrect: boolean) => void
}

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const shuffled = useMemo(() => {
    const entries = [
      { key: 'A', text: question.optionA },
      { key: 'B', text: question.optionB },
      { key: 'C', text: question.optionC },
      { key: 'D', text: question.optionD },
    ]
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[entries[i], entries[j]] = [entries[j], entries[i]]
    }
    const correctText = question[`option${question.correctAnswer}` as keyof typeof question]
    const newCorrectKey = OPTION_KEYS[entries.findIndex((e) => e.text === correctText)]
    return { entries, correctKey: newCorrectKey }
  }, [question])

  const options: Record<string, string> = {
    A: shuffled.entries[0].text,
    B: shuffled.entries[1].text,
    C: shuffled.entries[2].text,
    D: shuffled.entries[3].text,
  }

  const correctKey = shuffled.correctKey
  const isCorrect = selected === correctKey

  const handleSelect = (key: string) => {
    if (showFeedback) return
    setSelected(key)
    setShowFeedback(true)
  }

  const handleNext = () => {
    onAnswer(isCorrect)
  }

  // ── vB: editorial, card-free quiz layout ──
  if (themeConfig.isVB) {
    return (
      <div className="max-w-[640px] mx-auto px-4 pt-14 pb-8">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ color: '#A8A29E' }}
        >
          Question {questionNumber} of {totalQuestions}
        </p>

        <h2
          className="text-xl font-bold mb-8 leading-snug"
          style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
        >
          {question.question}
        </h2>

        <div className="space-y-3">
          {OPTION_KEYS.map((key) => {
            let bg = '#FFFFFF'
            let border = '#E8E4DC'
            let textColor = '#1C1917'
            let labelColor = '#A8A29E'

            if (showFeedback) {
              if (key === correctKey) {
                bg = '#EAF4EF'
                border = '#1A6B4A'
                textColor = '#1A6B4A'
                labelColor = '#1A6B4A'
              } else if (key === selected && !isCorrect) {
                bg = '#FEF2F2'
                border = '#DC2626'
                textColor = '#991B1B'
                labelColor = '#991B1B'
              } else {
                textColor = '#A8A29E'
                labelColor = '#D1CDC7'
              }
            } else if (key === selected) {
              border = '#1A6B4A'
              bg = '#EAF4EF'
              textColor = '#1A6B4A'
              labelColor = '#1A6B4A'
            }

            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                disabled={showFeedback}
                className="vb-btn-press w-full text-left flex items-center gap-4 px-4 py-4 rounded-lg border transition-all"
                style={{ background: bg, borderColor: border }}
              >
                <span
                  className="text-xs font-semibold w-5 flex-shrink-0"
                  style={{ color: labelColor }}
                >
                  {key}
                </span>
                <span className="text-sm flex-1" style={{ color: textColor }}>
                  {options[key]}
                </span>
              </button>
            )
          })}
        </div>

        {showFeedback && question.explanation && (
          <div
            className="mt-6 p-4 rounded-lg border"
            style={{ background: '#F5F0E8', borderColor: '#E8E4DC' }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: '#A8A29E' }}
            >
              Explanation
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#57534E' }}>
              {question.explanation}
            </p>
          </div>
        )}

        {showFeedback && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              className="vb-btn-press px-6 py-2.5 text-sm font-semibold"
              style={{ background: '#1A6B4A', color: '#FFFFFF', borderRadius: '8px' }}
            >
              {questionNumber === totalQuestions ? 'See results' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── vA: existing glass-card layout — unchanged ──
  const getOptionStyles = (key: string) => {
    if (!showFeedback) {
      return 'bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
    }

    if (key === correctKey) {
      return 'bg-[#DCFCE7] border-2 border-green-400'
    }

    if (key === selected && !isCorrect) {
      return 'bg-[#FEE2E2] border-2 border-red-400'
    }

    return 'bg-white border border-gray-200 opacity-60'
  }

  return (
    <div className="max-w-[680px] mx-auto bg-white/85 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500 mb-2">
        Question {questionNumber} of {totalQuestions}
      </p>

      <p className="font-bold text-gray-900 mb-6" style={{ fontSize: '18px' }}>
        {question.question}
      </p>

      <div className="space-y-3">
        {shuffled.entries.map(({ text }, index) => {
          const key = OPTION_KEYS[index]
          const isCorrectKey = key === correctKey
          const isWrongSelection = key === selected && !isCorrectKey
          const badgeBg = showFeedback
            ? isCorrectKey
              ? '#DCFCE7'
              : isWrongSelection
                ? '#FEE2E2'
                : '#F3F4F6'
            : '#F3F4F6'
          const badgeColor = showFeedback
            ? isCorrectKey
              ? '#15803D'
              : isWrongSelection
                ? '#DC2626'
                : '#4B5563'
            : '#4B5563'
          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={showFeedback}
              className={cn(
                'w-full text-left p-4 rounded-xl transition-all flex items-center gap-3 border',
                getOptionStyles(key)
              )}
            >
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{ backgroundColor: badgeBg, color: badgeColor }}
              >
                {key}
              </span>
              <span className="flex-1 text-sm text-gray-800 leading-relaxed">{text}</span>
              {showFeedback && isCorrectKey && (
                <span className="text-base flex-shrink-0">&#x2705;</span>
              )}
              {showFeedback && isWrongSelection && (
                <span className="text-base flex-shrink-0">&#x274C;</span>
              )}
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {showFeedback && question.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-gray-700">
              <span className="font-semibold">Explanation: </span>
              {question.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showFeedback && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleNext}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
              borderRadius: 'var(--button-radius)',
            }}
          >
            {questionNumber === totalQuestions ? 'See Results' : 'Next Question'}
          </Button>
        </div>
      )}
    </div>
  )
}
