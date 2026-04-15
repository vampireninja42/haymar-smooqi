import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { CourseOverview } from '@/components/lesson/CourseOverview'
import { BackButton } from '@/components/ui/BackButton'

export default async function CoursePage({ params }: { params: { courseSlug: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const course = await prisma.course.findUnique({
    where: { slug: params.courseSlug },
    include: {
      topic: true,
      lessons: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!course) redirect('/explore')

  // Fetch user progress for all lessons in this course
  const lessonProgress = await prisma.userProgress.findMany({
    where: { userId: session.user.id, courseId: course.id, lessonId: { not: null } },
  })

  // Get user subscription status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionStatus: true },
  })

  const isPremium = user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trialing'

  // Transform progress into Record<lessonId, { lessonCompleted, quizPassed }>
  const progress: Record<string, { lessonCompleted: boolean; quizPassed: boolean }> = {}
  for (const p of lessonProgress) {
    if (p.lessonId) {
      progress[p.lessonId] = {
        lessonCompleted: p.lessonCompleted,
        quizPassed: p.quizPassed,
      }
    }
  }

  return (
    <>
      <BackButton href="/explore" />
      <CourseOverview
        course={course}
        progress={progress}
        isUserFree={!isPremium}
      />
    </>
  )
}
