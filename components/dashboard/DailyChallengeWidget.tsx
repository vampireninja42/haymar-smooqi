'use client'

import { useState } from 'react'

interface DailyChallengeWidgetProps {
  challenge: {
    id: string
    question: {
      question: string
      optionA: string
      optionB: string
      optionC: string
      optionD: string
      correctAnswer: string
      explanation?: string | null
    }
  } | null
  existingAttempt: {
    selectedAnswer: string
    isCorrect: boolean
  } | null
}

export function DailyChallengeWidget({
  challenge,
  existingAttempt,
}: DailyChallengeWidgetProps) {
  const [selected, setSelected] = useState<string | null>(
    existingAttempt?.selectedAnswer ?? null
  )
  const [submitted, setSubmitted] = useState(!!existingAttempt)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(
    existingAttempt?.isCorrect ?? null
  )
  const [loading, setLoading] = useState(false)

  if (!challenge) return null

  const { question } = challenge
  const options = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD },
  ]

  async function handleSelect(key: string) {
    if (submitted) return
    setSelected(key)
    setLoading(true)
    try {
      const res = await fetch('/api/daily-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge!.id,
          selectedAnswer: key,
        }),
      })
      const data = await res.json()
      setIsCorrect(data.isCorrect)
      setSubmitted(true)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="rounded-[var(--card-radius)] p-4 shadow-sm overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-white">
          \u26A1 Daily Challenge
        </span>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-purple-600">
          +10 XP
        </span>
      </div>

      {/* Question */}
      <p className="mt-3 text-base font-semibold text-white">
        {question.question}
      </p>

      {/* Options */}
      <div className="mt-3 space-y-2">
        {options.map((opt) => {
          let bg = 'rgba(255,255,255,0.15)'
          let textColor = 'text-white'
          let borderColor = 'rgba(255,255,255,0.3)'

          if (submitted) {
            if (opt.key === question.correctAnswer) {
              bg = 'rgba(134,239,172,0.35)'
              borderColor = 'rgba(134,239,172,0.6)'
            } else if (opt.key === selected && !isCorrect) {
              bg = 'rgba(252,165,165,0.35)'
              borderColor = 'rgba(252,165,165,0.6)'
            }
          } else if (opt.key === selected) {
            bg = 'rgba(255,255,255,0.9)'
            textColor = 'text-purple-700'
            borderColor = 'rgba(255,255,255,0.9)'
          }

          return (
            <button
              key={opt.key}
              disabled={submitted || loading}
              onClick={() => handleSelect(opt.key)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${textColor} disabled:cursor-default`}
              style={{
                backgroundColor: bg,
                borderColor: borderColor,
              }}
              onMouseEnter={(e) => {
                if (!submitted && opt.key !== selected) {
                  e.currentTarget.style.backgroundColor =
                    'rgba(255,255,255,0.25)'
                }
              }}
              onMouseLeave={(e) => {
                if (!submitted && opt.key !== selected) {
                  e.currentTarget.style.backgroundColor =
                    'rgba(255,255,255,0.15)'
                }
              }}
            >
              <span className="font-medium">{opt.key}.</span> {opt.text}
            </button>
          )
        })}
      </div>

      {/* Result / Explanation */}
      {submitted && (
        <div className="mt-3">
          <p className="text-center text-sm font-medium text-white">
            {isCorrect
              ? 'Correct! +10 XP'
              : 'Not quite. Try again tomorrow!'}
          </p>
          {question.explanation && (
            <p className="mt-2 text-xs text-white/80">
              {question.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
