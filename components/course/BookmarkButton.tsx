'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
  courseId: string
  initialSaved: boolean
}

export function BookmarkButton({ courseId, initialSaved }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(initialSaved)

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setSaved((prev) => !prev)

    try {
      await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, saved: !saved }),
      })
    } catch {
      setSaved((prev) => !prev)
    }
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={saved ? 'Remove bookmark' : 'Add bookmark'}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
        'hover:bg-gray-100'
      )}
    >
      {saved ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5 text-[var(--color-primary)]"
        >
          <path
            fillRule="evenodd"
            d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21.75a.75.75 0 01-1.085.67L12 18.089l-7.165 4.332A.75.75 0 013.75 21.75V5.507c0-1.47 1.073-2.756 2.57-2.93z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
      )}
    </button>
  )
}
