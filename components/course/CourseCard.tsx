'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
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
    <Link href={`/learn/${course.slug}`} className="block">
      <Card
        className={cn(
          'relative overflow-hidden transition-shadow hover:shadow-md border-l-4',
          'rounded-[var(--card-radius)]',
          themeConfig.isVA && 'glass-card'
        )}
        style={{ borderLeftColor: topicColor.text }}
      >
        <CardContent className="p-5">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ backgroundColor: topicColor.bg, color: topicColor.text }}
              >
                <span>{course.topic.icon}</span>
                {course.topic.name}
              </span>
              <LevelBadge level={course.level} />
            </div>
            <BookmarkButton courseId={course.id} initialSaved={isSaved} />
          </div>

          <h3 className="mb-2 text-base font-bold leading-tight text-gray-900">
            {course.title}
          </h3>
          <p className="mb-4 line-clamp-1 text-sm text-gray-500">
            {course.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06V3.56a.75.75 0 00-.443-.68A8.962 8.962 0 0015 2.5a8.96 8.96 0 00-4.25 1.065V16.82zM9.25 4.565A8.96 8.96 0 005 2.5a8.962 8.962 0 00-2.557.38A.75.75 0 002 3.56v11.5a.75.75 0 00.954.721A7.462 7.462 0 015 15.5a7.46 7.46 0 014.25 1.32V4.565z" />
                </svg>
                {course.lessonCount} lessons
              </span>
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                    clipRule="evenodd"
                  />
                </svg>
                {course.estimatedMinutes} min
              </span>
            </div>
            {course.isFree ? (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                FREE
              </span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-gray-300"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </CardContent>

        {progress != null && progress > 0 && (
          <div className="h-1 w-full bg-gray-100">
            <div
              className="h-full rounded-r-full bg-[var(--color-primary)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </Card>
    </Link>
  )
}
