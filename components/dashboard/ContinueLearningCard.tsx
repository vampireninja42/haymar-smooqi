'use client'

import Link from 'next/link'

interface ContinueLearningCardProps {
  courseSlug: string
  courseTitle: string
  lessonSlug: string
  lessonTitle: string
  slidesCompleted: number
  totalSlides: number
}

export function ContinueLearningCard({
  courseSlug,
  courseTitle,
  lessonSlug,
  lessonTitle,
  slidesCompleted,
  totalSlides,
}: ContinueLearningCardProps) {
  const pct = totalSlides > 0 ? Math.round((slidesCompleted / totalSlides) * 100) : 0

  return (
    <Link
      href={`/learn/${courseSlug}/${lessonSlug}`}
      className="block rounded-[var(--card-radius)] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wide">
            Continue Learning
          </p>
          <h3 className="mt-1 truncate text-base font-semibold text-gray-900">
            {lessonTitle}
          </h3>
          <p className="text-xs text-gray-500">{courseTitle}</p>
        </div>
        <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="h-5 w-5">
            <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{slidesCompleted}/{totalSlides} slides</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
