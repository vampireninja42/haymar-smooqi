'use client'

import { useState, useCallback } from 'react'
import { CourseCard } from '@/components/course/CourseCard'
import { themeConfig } from '@/lib/theme'

export interface CourseGridItem {
  id: string
  slug: string
  title: string
  description: string
  level: string
  lessonCount: number
  estimatedMinutes: number
  isFree: boolean
  topic: { slug: string; name: string; icon: string }
  isSaved: boolean
}

interface Props {
  initialCourses: CourseGridItem[]
  initialHasMore: boolean
  filterParams: Record<string, string>
}

export function CourseGrid({ initialCourses, initialHasMore, filterParams }: Props) {
  const [courses, setCourses] = useState<CourseGridItem[]>(initialCourses)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const nextPage = page + 1
      const params = new URLSearchParams()
      Object.entries(filterParams).forEach(([k, v]) => {
        if (v) params.set(k, v)
      })
      params.set('page', String(nextPage))
      const res = await fetch(`/api/courses?${params.toString()}`)
      if (!res.ok) return
      const data = (await res.json()) as {
        courses: CourseGridItem[]
        hasMore: boolean
      }
      setCourses((prev) => [...prev, ...data.courses])
      setHasMore(data.hasMore)
      setPage(nextPage)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, filterParams])

  return (
    <>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={{
              id: course.id,
              slug: course.slug,
              title: course.title,
              description: course.description,
              level: course.level,
              lessonCount: course.lessonCount,
              estimatedMinutes: course.estimatedMinutes,
              isFree: course.isFree,
              topic: course.topic,
            }}
            isSaved={course.isSaved}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          {themeConfig.isVB ? (
            <button
              onClick={loadMore}
              disabled={loading}
              className="inline-block px-6 py-2.5 text-sm font-medium border transition-colors disabled:opacity-60"
              style={{
                borderColor: '#1A6B4A',
                color: '#1A6B4A',
                borderRadius: '8px',
                background: '#FFFFFF',
              }}
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
          ) : (
            <button
              onClick={loadMore}
              disabled={loading}
              className="inline-block rounded-[var(--button-radius)] border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}
    </>
  )
}
