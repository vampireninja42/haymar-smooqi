import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { themeConfig } from '@/lib/theme'
import { TopicActions } from './TopicActions'
import { BackButton } from '@/components/ui/BackButton'

export const dynamic = 'force-dynamic'

interface TopicPageProps {
  params: Promise<{ topicSlug: string }>
}

export default async function TopicPage({ params }: TopicPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  const userId = session.user.id

  const { topicSlug } = await params

  const [topic, userSelection, selectionCount, userProgressList] = await Promise.all([
    prisma.topic.findUnique({
      where: { slug: topicSlug },
      include: {
        courses: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
              select: { id: true, slug: true, title: true, sortOrder: true },
            },
          },
        },
      },
    }),
    prisma.userTopicSelection.findFirst({
      where: { userId, topic: { slug: topicSlug } },
    }),
    prisma.userTopicSelection.count({ where: { userId } }),
    prisma.userProgress.findMany({
      where: { userId },
      select: { courseId: true, lessonId: true, lessonCompleted: true, courseCompleted: true },
    }),
  ])

  if (!topic) notFound()

  const colors = themeConfig.topicColors[topic.slug] ?? { bg: '#F3F4F6', text: '#374151' }
  const isSelected = !!userSelection
  const canAdd = selectionCount < 5

  // Build progress map
  const lessonProgress = new Map<string, boolean>()
  const courseProgress = new Map<string, boolean>()
  for (const p of userProgressList) {
    if (p.lessonId && p.lessonCompleted) lessonProgress.set(p.lessonId, true)
    if (p.courseCompleted) courseProgress.set(p.courseId, true)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton href="/explore" />
      {/* Topic header */}
      {themeConfig.isVB ? (
        <div
          className="rounded-[var(--card-radius)] px-5 py-6 mb-5"
          style={{ backgroundColor: colors.bg, border: '1px solid #E8E4DC' }}
        >
          <span className="text-3xl mb-3 block">{topic.icon}</span>
          <h1
            className="text-2xl font-bold leading-tight mb-2"
            style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
          >
            {topic.name}
          </h1>
          <p className="text-sm" style={{ color: '#57534E' }}>
            {topic.description}
          </p>
          <p className="text-xs mt-2" style={{ color: '#A8A29E' }}>
            {topic.courses.length} course{topic.courses.length !== 1 ? 's' : ''}
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
            style={{ backgroundColor: colors.bg }}
          >
            {topic.icon}
          </span>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{topic.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{topic.description}</p>
            <p className="mt-1 text-xs text-gray-400">
              {topic.courses.length} course{topic.courses.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Add/Remove topic */}
      <div className="mt-4">
        <TopicActions
          topicId={topic.id}
          isSelected={isSelected}
          canAdd={canAdd}
          selectionCount={selectionCount}
        />
      </div>

      {/* Course list */}
      {themeConfig.isVB ? (
        <div
          className="mt-6 bg-white border rounded-[var(--card-radius)] overflow-hidden"
          style={{ borderColor: '#E8E4DC' }}
        >
          {topic.courses.map((course, idx) => {
            const isCompleted = courseProgress.get(course.id)
            return (
              <Link
                key={course.id}
                href={`/learn/${course.slug}`}
                className="flex items-center gap-4 px-5 py-4 border-b last:border-b-0 hover:bg-[#FAFAF6] transition-colors"
                style={{ borderColor: '#E8E4DC' }}
              >
                {/* Number / check */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold"
                  style={
                    isCompleted
                      ? { background: '#EAF4EF', color: '#1A6B4A' }
                      : { background: '#F5F5F0', color: '#57534E' }
                  }
                >
                  {isCompleted ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Course info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold leading-snug"
                    style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
                  >
                    {course.title}
                  </p>
                  <div
                    className="flex items-center gap-3 mt-0.5 text-xs"
                    style={{ color: '#A8A29E' }}
                  >
                    <span>{course.lessons.length} lessons</span>
                    <span>{course.estimatedMinutes} min</span>
                    <span className="capitalize">{course.level}</span>
                    {course.isFree && (
                      <span
                        className="font-semibold px-1.5 py-0.5 rounded"
                        style={{ background: '#EAF4EF', color: '#1A6B4A', fontSize: '10px' }}
                      >
                        FREE
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ color: '#A8A29E', flexShrink: 0 }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {topic.courses.map((course, idx) => {
            const isCompleted = courseProgress.get(course.id)
            return (
              <div
                key={course.id}
                className={`rounded-[var(--card-radius)] p-4 shadow-sm border-l-4 ${
                  isCompleted
                    ? 'bg-green-50 border-green-400'
                    : 'bg-white border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold flex-shrink-0"
                    style={{
                      backgroundColor: isCompleted ? '#D1FAE5' : colors.bg,
                      color: isCompleted ? '#059669' : colors.text,
                    }}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/learn/${course.slug}`}
                        className="text-sm font-semibold text-gray-900 hover:text-[var(--color-primary)]"
                      >
                        {course.title}
                      </Link>
                      {isCompleted && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                      <span>{course.lessonCount} lessons</span>
                      <span>{course.estimatedMinutes} min</span>
                      <span className="capitalize">{course.level}</span>
                      {course.isFree && (
                        <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                          FREE
                        </span>
                      )}
                    </div>

                    {/* Expandable lesson list */}
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-medium text-[var(--color-primary)]">
                        View lessons
                      </summary>
                      <ul className="mt-1.5 space-y-1 pl-1">
                        {course.lessons.map((lesson) => {
                          const done = lessonProgress.get(lesson.id)
                          return (
                            <li key={lesson.id} className="flex items-center gap-2">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  done ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                              />
                              <Link
                                href={`/learn/${course.slug}/${lesson.slug}`}
                                className="text-xs text-gray-600 hover:text-[var(--color-primary)]"
                              >
                                {lesson.title}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </details>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
