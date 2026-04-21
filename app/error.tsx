'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card
        className="max-w-md w-full p-8 text-center"
        style={{ borderRadius: 'var(--card-radius)' }}
      >
        <div
          className="mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          !
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-sm text-gray-500 mb-6">
          {isDev ? error.message : 'Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
              borderRadius: 'var(--button-radius)',
            }}
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            style={{ borderRadius: 'var(--button-radius)' }}
          >
            Go Home
          </Button>
        </div>
      </Card>
    </div>
  )
}
