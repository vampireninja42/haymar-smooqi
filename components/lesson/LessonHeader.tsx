'use client'

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
  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
      <button
        onClick={onBack}
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 -ml-1"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </button>

      <h1 className="text-sm font-semibold text-gray-900 truncate max-w-[220px] text-center">
        {lessonTitle}
      </h1>

      <span className="text-xs text-gray-400 min-w-[52px] text-right">{slideIndex + 1}/{totalSlides}</span>
    </div>
  )
}
