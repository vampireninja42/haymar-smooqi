'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TopicActionsProps {
  topicId: string
  isSelected: boolean
  canAdd: boolean
  selectionCount: number
}

export function TopicActions({
  topicId,
  isSelected,
  canAdd,
  selectionCount,
}: TopicActionsProps) {
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(isSelected)
  const router = useRouter()

  async function handleToggle() {
    setLoading(true)
    try {
      const res = await fetch('/api/topics/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, action: selected ? 'remove' : 'add' }),
      })
      if (res.ok) {
        setSelected(!selected)
        router.refresh()
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  if (!selected && !canAdd) {
    return (
      <p className="text-xs text-gray-400">
        You have {selectionCount}/5 topics selected. Remove one to add this topic.
      </p>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-[var(--button-radius)] px-5 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
        selected
          ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          : 'bg-[var(--color-primary)] text-white hover:opacity-90'
      }`}
    >
      {loading
        ? 'Updating...'
        : selected
          ? 'Remove from My Topics'
          : 'Add to My Topics'}
    </button>
  )
}
