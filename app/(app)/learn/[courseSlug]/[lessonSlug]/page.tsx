import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { LessonPlayer } from '@/components/lesson/LessonPlayer'
import { BackButton } from '@/components/ui/BackButton'

export default async function LessonPage({ params }: { params: { courseSlug: string; lessonSlug: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const lesson = await prisma.lesson.findFirst({
    where: { slug: params.lessonSlug, course: { slug: params.courseSlug } },
    include: {
      slides: { orderBy: { slideOrder: 'asc' } },
      quizQuestions: { orderBy: { sortOrder: 'asc' }, take: 3 },
      course: {
        include: {
          topic: true,
          lessons: { orderBy: { sortOrder: 'asc' }, select: { id: true, slug: true, sortOrder: true } },
        },
      },
    },
  })

  if (!lesson) redirect('/explore')

  // Fetch user progress for this lesson
  const progress = await prisma.userProgress.findUnique({
    where: {
      userId_courseId_lessonId: {
        userId: session.user.id,
        courseId: lesson.courseId,
        lessonId: lesson.id,
      },
    },
    select: { lessonCompleted: true, quizPassed: true, quizScore: true },
  })

  return (
    <>
      <BackButton href={`/learn/${params.courseSlug}`} />
      <LessonPlayer
        lesson={lesson}
        initialProgress={progress}
        userId={session.user.id}
      />
    </>
  )
}
