'use client'

import { useState } from 'react'

interface DailyChallengeWidgetProps {
  challengeId: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanation: string | null
  alreadyAttempted: boolean
  previousAnswer?: string | null
  wasCorrect?: boolean | null
}

export function DailyChallengeWidget({
  challengeId,
  question,
  optionA,
  optionB,
  optionC,
  optionD,
  correctAnswer,
  explanation,
  alreadyAttempted,
  previousAnswer,
  wasCorrect,
}: DailyChallengeWidgetProps) {
  const [selected, setSelected] = useState<string | null>(previousAnswer ?? null)
  const [submitted, setSubmitted] = useState(alreadyAttempted)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(wasCorrect ?? null)
  const [loading, setLoading] = useState(false)

  const options = [
    { key: 'A', text: optionA },
    { key: 'B', text: optionB },
    { key: 'C', text: optionC },
    { key: 'D', text: optionD },
  ]

  async function handleSubmit() {
    if (!selected || submitted) return
    setLoading(true)
    try {
      const res = await fetch('/api/daily-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, selectedAnswer: selected }),
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
    <div className="rounded-[var(--card-radius)] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl">&#127919;</span>
        <h3 className="text-sm font-semibold text-gray-900">Daily Challenge</h3>
      </div>

      <p className="mt-2 text-sm text-gray-700">{question}</p>

      <div className="mt-3 space-y-2">
        {options.map((opt) => {
          let bg = 'bg-gray-50 hover:bg-gray-100'
          let border = 'border-gray-200'
          if (submitted) {
            if (opt.key === correctAnswer) {
              bg = 'bg-green-50'
              border = 'border-green-400'
            } else if (opt.key === selected && !isCorrect) {
              bg = 'bg-red-50'
              border = 'border-red-400'
            }
          } else if (opt.key === selected) {
            bg = 'bg-[var(--color-primary-light)]'
            border = 'border-[var(--color-primary)]'
          }
          return (
            <button
              key={opt.key}
              disabled={submitted}
              onClick={() => setSelected(opt.key)}
              className={`w-full rounded-lg border ${border} ${bg} px-3 py-2 text-left text-sm transition-colors`}
            >
              <span className="font-medium text-gray-600">{opt.key}.</span> {opt.text}
            </button>
          )
        })}
      </div>

      {submitted && explanation && (
        <p className="mt-3 rounded-lg bg-blue-50 p-2 text-xs text-blue-700">{explanation}</p>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected || loading}
          className="mt-3 w-full rounded-[var(--button-radius)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Answer'}
        </button>
      )}

      {submitted && (
        <p className={`mt-2 text-center text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? 'Correct! +20 XP' : 'Not quite. Try again tomorrow!'}
        </p>
      )}
    </div>
  )
}
