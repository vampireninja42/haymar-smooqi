import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { CourseCard } from '@/components/course/CourseCard'
import { FilterButton } from '@/components/explore/FilterButton'

export const dynamic = 'force-dynamic'

const ITEMS_PER_PAGE = 12

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string
    topic?: string
    level?: string
    access?: string
    sort?: string
    page?: string
  }>
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  const userId = session.user.id

  const params = await searchParams
  const q = params.q ?? ''
  const topicFilter = params.topic ?? ''
  const levelFilter = params.level ?? ''
  const accessFilter = params.access ?? ''
  const sort = params.sort ?? 'popular'
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (topicFilter) where.topic = { slug: topicFilter }
  if (levelFilter) where.level = levelFilter
  if (accessFilter === 'free') where.isFree = true
  if (accessFilter === 'premium') where.isFree = false

  // Sort
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = [{ sortOrder: 'asc' }]
  if (sort === 'newest') orderBy = [{ id: 'desc' }]
  if (sort === 'level') orderBy = [{ level: 'asc' }, { sortOrder: 'asc' }]

  const [topics, courses, totalCount, savedCourseRows] = await Promise.all([
    prisma.topic.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.course.findMany({
      where,
      include: { topic: true },
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.course.count({ where }),
    prisma.userSavedCourse.findMany({
      where: { userId },
      select: { courseId: true },
    }),
  ])

  const savedIds = new Set(savedCourseRows.map((s) => s.courseId))
  const hasMore = page * ITEMS_PER_PAGE < totalCount

  // Helper for building filter URLs
  function filterUrl(overrides: Record<string, string>) {
    const p = new URLSearchParams()
    const merged = { q, topic: topicFilter, level: levelFilter, access: accessFilter, sort, ...overrides }
    Object.entries(merged).forEach(([k, v]) => {
      if (v) p.set(k, v)
    })
    return `/explore?${p.toString()}`
  }

  const activeFilterCount = [topicFilter, levelFilter, accessFilter].filter(Boolean).length

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-xl font-bold text-gray-900">Explore Courses</h1>
      <p className="mt-1 text-sm text-gray-500">
        Discover new topics and grow your skills.
      </p>

      {/* Search bar + filter button */}
      <div className="mt-4 flex items-center gap-3">
        <form className="flex-1">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search courses..."
              className="w-full rounded-[var(--button-radius)] border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
        </form>

        <FilterButton
          topics={topics.map((t) => ({ slug: t.slug, name: t.name, icon: t.icon }))}
          totalCount={totalCount}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* Course grid */}
      <div className="mt-5">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[var(--card-radius)] bg-white py-16 text-center shadow-sm">
            <span className="text-3xl">&#128269;</span>
            <p className="mt-3 text-sm font-medium text-gray-900">
              No courses found
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Try adjusting your filters or search query.
            </p>
            <Link
              href="/explore"
              className="mt-4 rounded-[var(--button-radius)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
            >
              Clear Filters
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs text-gray-400">
              {totalCount} course{totalCount !== 1 ? 's' : ''}
            </p>
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
                    topic: {
                      slug: course.topic.slug,
                      name: course.topic.name,
                      icon: course.topic.icon,
                    },
                  }}
                  isSaved={savedIds.has(course.id)}
                />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-6 text-center">
                <Link
                  href={filterUrl({ page: String(page + 1) })}
                  className="inline-block rounded-[var(--button-radius)] border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Load More
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
