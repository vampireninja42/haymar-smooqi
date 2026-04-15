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
      <div className="mt-6 space-y-4">
        {topic.courses.map((course, idx) => {
          const isCompleted = courseProgress.get(course.id)
          return (
            <div
              key={course.id}
              className="rounded-[var(--card-radius)] bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: isCompleted ? '#D1FAE5' : colors.bg,
                    color: isCompleted ? '#059669' : colors.text,
                  }}
                >
                  {isCompleted ? '\u2713' : idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/learn/${course.slug}`}
                    className="text-sm font-semibold text-gray-900 hover:text-[var(--color-primary)]"
                  >
                    {course.title}
                  </Link>
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
    </div>
  )
}
