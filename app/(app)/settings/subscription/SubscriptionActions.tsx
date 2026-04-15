'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type ActionType = 'upgrade' | 'manage' | 'resubscribe'

export function SubscriptionActions({ action }: { action: ActionType }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleManage() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
          return
        }
      }
    } catch {
      // ignore
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
      <Button
        onClick={handleManage}
        disabled={loading}
        variant="outline"
        className="mt-4 rounded-[var(--button-radius)]"
      >
        {loading ? 'Loading...' : 'Manage Subscription'}
      </Button>
    )
  }

  if (action === 'resubscribe') {
    return (
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
    )
  }

  return null
}
