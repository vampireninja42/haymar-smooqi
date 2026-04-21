'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type ActionType = 'upgrade' | 'manage' | 'resubscribe'

export function SubscriptionActions({ action }: { action: ActionType }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleManage() {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      if (res.status === 503) {
        setMessage('Payment portal coming soon.')
        return
      }
      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
          return
        }
      }
      setMessage('Unable to open billing portal. Please try again.')
    } catch {
      setMessage('Unable to open billing portal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (action === 'upgrade') {
    return (
      <Button
        onClick={() => router.push('/pricing')}
        className="mt-4 rounded-[var(--button-radius)]"
      >
        Upgrade to Premium
      </Button>
    )
  }

  if (action === 'manage') {
    return (
      <div>
        <Button
          onClick={handleManage}
          disabled={loading}
          variant="outline"
          className="mt-4 rounded-[var(--button-radius)]"
        >
          {loading ? 'Loading...' : 'Manage Subscription'}
        </Button>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    )
  }

  if (action === 'resubscribe') {
    return (
      <div>
        <div className="mt-4 flex gap-3">
          <Button
            onClick={() => router.push('/pricing')}
            className="rounded-[var(--button-radius)]"
          >
            Resubscribe
          </Button>
          <Button
            onClick={handleManage}
            disabled={loading}
            variant="outline"
            className="rounded-[var(--button-radius)]"
          >
            {loading ? 'Loading...' : 'Manage Billing'}
          </Button>
        </div>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    )
  }

  return null
}
