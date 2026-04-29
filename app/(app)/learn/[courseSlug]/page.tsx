import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { CourseOverview } from '@/components/lesson/CourseOverview'
import { VbCourseOverview } from '@/components/lesson/VbCourseOverview'
import { BackButton } from '@/components/ui/BackButton'
import { themeConfig } from '@/lib/theme'
import { isPremium } from '@/lib/subscription'

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
    select: { subscriptionStatus: true, trialEndsAt: true },
  })

  const userIsPremium = user ? isPremium(user) : false

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
      {themeConfig.isVB ? (
        <VbCourseOverview
          course={course}
          progress={progress}
          isUserFree={!userIsPremium}
        />
      ) : (
        <CourseOverview
          course={course}
          progress={progress}
          isUserFree={!userIsPremium}
        />
      )}
    </>
  )
}
