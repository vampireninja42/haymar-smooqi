'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ReviewItem {
  lessonId: string
  lessonTitle: string
  slidePreview: string
}

export function ReviewCards({ reviews }: { reviews: ReviewItem[] }) {
  const [items, setItems] = useState(reviews)
  const [loading, setLoading] = useState<string | null>(null)

  async function handleRate(lessonId: string, rating: 0 | 1 | 2) {
    setLoading(lessonId)
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, rating }),
      })
      setItems((prev) => prev.filter((i) => i.lessonId !== lessonId))
    } catch {
      // silent
    } finally {
      setLoading(null)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-12 text-center">
        <p className="text-4xl">&#x1F389;</p>
        <p className="mt-3 text-lg font-semibold text-gray-900">All caught up!</p>
        <p className="mt-1 text-gray-500">Check back tomorrow.</p>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {items.map((item) => (
        <Card key={item.lessonId}>
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900">{item.lessonTitle}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-gray-600">{item.slidePreview}</p>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                disabled={loading === item.lessonId}
                onClick={() => handleRate(item.lessonId, 0)}
              >
                Missed it &#x2717;
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                disabled={loading === item.lessonId}
                onClick={() => handleRate(item.lessonId, 1)}
              >
                Almost
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                disabled={loading === item.lessonId}
                onClick={() => handleRate(item.lessonId, 2)}
              >
                Got it &#x2713;
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
