'use client'

import { CourseCard, type CourseData } from '@/components/course/CourseCard'

interface RecommendedCoursesProps {
  courses: CourseData[]
  savedCourseIds: string[]
}

export function RecommendedCourses({ courses, savedCourseIds }: RecommendedCoursesProps) {
  if (courses.length === 0) return null

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Recommended for You</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isSaved={savedCourseIds.includes(course.id)}
          />
        ))}
      </div>
    </div>
  )
}
