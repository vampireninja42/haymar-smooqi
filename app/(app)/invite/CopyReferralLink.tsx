'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function CopyReferralLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const link =
    typeof window !== 'undefined'
      ? `${window.location.origin}/signup?ref=${code}`
      : `/signup?ref=${code}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
      <div className="flex-1 overflow-hidden">
        <p className="text-xs text-gray-400 mb-1">Your referral code</p>
        <p className="truncate rounded-lg bg-white px-4 py-2 text-center font-mono text-lg font-bold text-purple-600 border border-gray-200">
          {code}
        </p>
      </div>
      <Button onClick={handleCopy} className="shrink-0 rounded-full">
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
    </div>
  )
}
