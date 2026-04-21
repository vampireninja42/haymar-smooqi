'use client'

import { themeConfig } from '@/lib/theme'

type LessonHeaderProps = {
  lessonTitle: string
  slideIndex: number
  totalSlides: number
  onBack: () => void
}

export function LessonHeader({
  lessonTitle,
  slideIndex,
  totalSlides,
  onBack,
}: LessonHeaderProps) {
  const progress = totalSlides > 0 ? ((slideIndex + 1) / totalSlides) * 100 : 0
  const isVB = themeConfig.isVB

  return (
    <div>
      <div
        className="flex items-center justify-between mb-4 pb-3 border-b"
        style={{ borderColor: isVB ? '#E8E4DC' : undefined }}
      >
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 -ml-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <h1
          className="text-sm font-semibold truncate max-w-[220px] text-center"
          style={
            isVB
              ? { color: '#1C1917', fontFamily: 'var(--font-playfair)' }
              : { color: '#111827' }
          }
        >
          {lessonTitle}
        </h1>

        <span className="text-xs text-gray-400 min-w-[52px] text-right">{slideIndex + 1}/{totalSlides}</span>
      </div>

      {/* Progress indicator */}
      {isVB ? (
        <div className="h-[2px] w-full mb-4" style={{ background: '#E8E4DC' }}>
          <div
            className="h-full transition-all"
            style={{ width: `${progress}%`, background: '#1A6B4A' }}
          />
        </div>
      ) : null}
    </div>
  )
}
