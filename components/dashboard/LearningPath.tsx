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
      <div className={`rounded-[var(--card-radius)] p-6 text-center shadow-sm ${themeConfig.isVA ? 'glass-card' : 'bg-white'}`}>
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
    <div className="space-y-4">
      {topicSelections.map((ts) => {
        const colors = themeConfig.topicColors[ts.topic.slug] ?? { bg: '#F3F4F6', text: '#374151' }
        const visibleCourses = ts.topic.courses.slice(0, 3)
        const remainingCount = ts.topic.courses.length - 3

        return (
          <div
            key={ts.topicId}
            className={`overflow-hidden rounded-[var(--card-radius)] shadow-sm ${themeConfig.isVA ? 'glass-card' : 'bg-white'}`}
            style={{ borderLeft: `4px solid ${colors.text}` }}
          >
            {/* Colored header band */}
            <div
              className="flex items-center gap-2.5 px-4 py-3"
              style={{ backgroundColor: colors.bg }}
            >
              <span className="text-xl">{ts.topic.icon}</span>
              <span className="text-sm font-bold" style={{ color: colors.text }}>
                {ts.topic.name}
              </span>
              <span
                className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                style={{ backgroundColor: colors.text }}
              >
                {ts.topic.courses.length}
              </span>
            </div>

            {/* Course rows */}
            <div className="divide-y divide-gray-50 px-4">
              {visibleCourses.map((course, idx) => (
                <Link
                  key={course.id}
                  href={`/learn/${course.slug}`}
                  className="flex items-center gap-3 py-3 group"
                >
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ backgroundColor: colors.text }}
                  >
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-sm text-gray-700 group-hover:text-[var(--color-primary)] transition-colors">
                    {course.title}
                  </span>
                  <span className="text-gray-400 text-xs">&rarr;</span>
                </Link>
              ))}
            </div>

            {/* See all footer */}
            {remainingCount > 0 && (
              <div className="border-t border-gray-50 px-4 py-2.5">
                <Link
                  href={`/topics/${ts.topic.slug}`}
                  className="text-xs font-medium"
                  style={{ color: colors.text }}
                >
                  See all {ts.topic.courses.length} courses &rarr;
                </Link>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
