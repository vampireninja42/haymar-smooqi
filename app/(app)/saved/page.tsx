import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { CourseCard } from '@/components/course/CourseCard'
import { BackButton } from '@/components/ui/BackButton'

export const dynamic = 'force-dynamic'

export default async function SavedPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  const userId = session.user.id

  const savedCourses = await prisma.userSavedCourse.findMany({
    where: { userId },
    include: {
      course: {
        include: { topic: true },
      },
    },
    orderBy: { savedAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-3xl">
      <BackButton href="/home" />
      <h1 className="text-xl font-bold text-gray-900">Saved Courses</h1>
      <p className="mt-1 text-sm text-gray-500">
        Courses you bookmarked for later.
      </p>

      {savedCourses.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-[var(--card-radius)] bg-white py-16 text-center shadow-sm">
          <span className="text-3xl">&#128278;</span>
          <p className="mt-3 text-sm font-medium text-gray-900">
            No saved courses yet
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Browse courses and bookmark the ones you want to take later.
          </p>
          <Link
            href="/explore"
            className="mt-4 rounded-[var(--button-radius)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
          >
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {savedCourses.map(({ course }) => (
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
                topic: {
                  slug: course.topic.slug,
                  name: course.topic.name,
                  icon: course.topic.icon,
                },
              }}
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
