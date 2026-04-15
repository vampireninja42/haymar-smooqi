'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function UpgradePrompt() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-white shadow-lg">
      <div className="flex items-start gap-3">
        <span className="text-2xl">&#x1F512;</span>
        <div>
          <h3 className="text-lg font-bold">Premium Content</h3>
          <p className="mt-1 text-sm text-purple-100">
            Unlock all intermediate &amp; advanced courses with full access to
            every lesson, quiz, and spaced repetition review.
          </p>
          <Link href="/pricing">
            <Button
              variant="secondary"
              className="mt-4 rounded-full bg-white text-purple-700 hover:bg-purple-50"
            >
              Start 7-day free trial &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
