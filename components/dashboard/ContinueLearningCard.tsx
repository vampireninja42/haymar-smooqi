'use client'

import Link from 'next/link'

interface ContinueLearningCardProps {
  lessonTitle?: string
  courseName?: string
  courseSlug?: string
  lessonSlug?: string
}

export function ContinueLearningCard({
  lessonTitle,
  courseName,
  courseSlug,
  lessonSlug,
}: ContinueLearningCardProps) {
  if (!lessonTitle || !courseSlug || !lessonSlug) return null

  return (
    <Link
      href={`/learn/${courseSlug}/${lessonSlug}`}
      className="block relative overflow-hidden rounded-[var(--card-radius)] p-4 shadow-sm transition-shadow hover:shadow-md"
      style={{
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      }}
    >
      {/* Decorative circle */}
      <div
        className="absolute -bottom-6 -right-6 rounded-full pointer-events-none"
        style={{
          width: 120,
          height: 120,
          backgroundColor: 'rgba(255,255,255,0.12)',
        }}
      />

      <p className="text-xs uppercase tracking-widest text-white/80 font-medium">
        Continue Learning
      </p>
      <h3 className="mt-1.5 text-xl font-bold text-white">{lessonTitle}</h3>
      {courseName && (
        <p className="mt-0.5 text-sm text-white/70">{courseName}</p>
      )}

      <div className="mt-3">
        <span className="inline-block rounded-full bg-white px-6 py-2 text-sm font-semibold text-[var(--color-primary)]">
          Continue
        </span>
      </div>
    </Link>
  )
}
