'use client'

import Link from 'next/link'
import { themeConfig } from '@/lib/theme'

interface LessonInfo {
  id: string
  slug: string
  title: string
  sortOrder: number
}

interface CourseInfo {
  id: string
  slug: string
  title: string
  sortOrder: number
  lessons: LessonInfo[]
}

interface TopicInfo {
  slug: string
  name: string
  icon: string
  courses: CourseInfo[]
}

export interface TopicSelectionData {
  topicId: string
  topic: TopicInfo
}

interface LearningPathProps {
  topicSelections: TopicSelectionData[]
}

export function LearningPath({ topicSelections }: LearningPathProps) {
  if (topicSelections.length === 0) {
    return (
      <div className="rounded-[var(--card-radius)] bg-white p-6 text-center shadow-sm">
        <p className="text-2xl">&#128218;</p>
        <p className="mt-2 text-sm font-medium text-gray-900">No topics selected yet</p>
        <p className="mt-1 text-xs text-gray-500">Choose topics to build your learning path.</p>
        <Link
          href="/explore"
          className="mt-3 inline-block rounded-[var(--button-radius)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
        >
          Explore Topics
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Your Learning Path</h3>
      <div className="space-y-4">
        {topicSelections.map((ts) => {
          const colors = themeConfig.topicColors[ts.topic.slug] ?? { bg: '#F3F4F6', text: '#374151' }
          return (
            <div key={ts.topicId} className="rounded-[var(--card-radius)] bg-white p-4 shadow-sm">
              <Link href={`/topics/${ts.topic.slug}`} className="flex items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-base"
                  style={{ backgroundColor: colors.bg }}
                >
                  {ts.topic.icon}
                </span>
                <span className="text-sm font-semibold text-gray-900">{ts.topic.name}</span>
                <span className="ml-auto text-xs text-gray-400">{ts.topic.courses.length} courses</span>
              </Link>

              <div className="mt-2 space-y-1 pl-10">
                {ts.topic.courses.slice(0, 3).map((course) => (
                  <Link
                    key={course.id}
                    href={`/learn/${course.slug}`}
                    className="block text-xs text-gray-600 hover:text-[var(--color-primary)]"
                  >
                    {course.title}
                  </Link>
                ))}
                {ts.topic.courses.length > 3 && (
                  <Link
                    href={`/topics/${ts.topic.slug}`}
                    className="block text-xs font-medium text-[var(--color-primary)]"
                  >
                    +{ts.topic.courses.length - 3} more
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
