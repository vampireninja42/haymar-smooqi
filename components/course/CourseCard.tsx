'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { themeConfig } from '@/lib/theme'
import { LevelBadge } from './LevelBadge'
import { BookmarkButton } from './BookmarkButton'

interface CourseTopic {
  slug: string
  name: string
  icon: string
}

export interface CourseData {
  id: string
  slug: string
  title: string
  description: string
  level: string
  lessonCount: number
  estimatedMinutes: number
  isFree: boolean
  topic: CourseTopic
}

interface CourseCardProps {
  course: CourseData
  isSaved: boolean
  progress?: number
}

export function CourseCard({ course, isSaved, progress }: CourseCardProps) {
  const topicColor = themeConfig.topicColors[course.topic.slug] ?? {
    bg: '#F3F4F6',
    text: '#374151',
  }

  return (
    <Link href={`/learn/${course.slug}`} className="block h-full">
      <div
        className={cn(
          'rounded-[var(--card-radius)] p-4 flex flex-col gap-2 h-full transition-shadow hover:shadow-md',
          themeConfig.isVA ? 'glass-card' : 'bg-white shadow-sm'
        )}
      >
        {/* Row 1: Topic pill (left) + Bookmark (right) */}
        <div className="flex items-start justify-between gap-2">
          <span
            className="text-xs font-semibold leading-tight"
            style={{ color: topicColor.text }}
          >
            {course.topic.icon} {course.topic.name}
          </span>
          <BookmarkButton courseId={course.id} initialSaved={isSaved} />
        </div>

        {/* Row 2: Level badge */}
        <div>
          <LevelBadge level={course.level} />
        </div>

        {/* Row 3: Course title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug flex-1">
          {course.title}
        </h3>

        {/* Row 4: Description */}
        <p className="text-xs text-gray-500 line-clamp-2">{course.description}</p>

        {/* Row 5: Bottom metadata */}
        <div className="flex items-center gap-3 mt-auto pt-2">
          <span className="text-xs text-gray-400">{'\uD83D\uDCDA'} {course.lessonCount} lessons</span>
          <span className="text-xs text-gray-400">{'\u23F1'} {course.estimatedMinutes} min</span>
          <span className="ml-auto">
            {course.isFree
              ? <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">FREE</span>
              : <span className="text-gray-400 text-sm">{'\uD83D\uDD12'}</span>
            }
          </span>
        </div>

        {/* Progress bar */}
        {progress != null && progress > 0 && (
          <div className="h-1 w-full rounded-full bg-gray-100 mt-1">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  )
}
