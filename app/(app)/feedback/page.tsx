'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/BackButton'
import { cn } from '@/lib/utils'

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (rating < 1) {
      setError('Tap a star to rate first.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, message: message.trim() || undefined }),
      })
      if (res.ok) {
        setDone(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Failed to send feedback.')
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md">
        <BackButton href="/home" />
        <div className="mt-10 rounded-[var(--card-radius)] bg-white p-8 text-center shadow-sm">
          <p className="text-5xl">🙏</p>
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Thanks for your feedback!
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            We read every rating. Your input shapes what we build next.
          </p>
          <Button
            onClick={() => (window.location.href = '/home')}
            className="mt-6"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
              borderRadius: 'var(--button-radius)',
            }}
          >
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <BackButton href="/home" />

      <h1 className="text-2xl font-bold text-gray-900">Rate Smooqi</h1>
      <p className="mt-1 text-sm text-gray-500">
        How&apos;s the app feeling? Your rating goes straight to the team.
      </p>

      <div className="mt-6 rounded-[var(--card-radius)] bg-white p-6 shadow-sm">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hover || rating) >= n
            return (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                className={cn(
                  'text-4xl transition-transform',
                  active ? 'scale-110' : 'opacity-40 hover:opacity-70'
                )}
                style={{ color: active ? 'var(--color-primary)' : '#9CA3AF' }}
              >
                ★
              </button>
            )
          })}
        </div>

        <p className="mt-3 text-center text-xs text-gray-400">
          {rating === 0
            ? 'Tap a star'
            : rating <= 2
              ? 'Thanks — we want to do better.'
              : rating === 3
                ? 'Room to grow.'
                : rating === 4
                  ? 'Glad you like it.'
                  : 'You just made our day.'}
        </p>

        <label className="mt-5 block text-xs font-medium text-gray-600">
          Tell us more (optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="What works, what doesn't, what you wish existed..."
          className="mt-1 w-full rounded-[var(--button-radius)] border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />

        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-5 w-full"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
            borderRadius: 'var(--button-radius)',
          }}
        >
          {submitting ? 'Sending...' : 'Send feedback'}
        </Button>
      </div>
    </div>
  )
}
