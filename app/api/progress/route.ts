import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkAndUnlockAchievements } from '@/lib/achievements'
import { apiRateLimit } from '@/lib/rateLimit'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const schema = z.object({
  courseId: z.string(),
  lessonId: z.string().optional(),
  type: z.enum(['lesson_complete', 'quiz_result', 'course_complete', 'slide_progress']),
  quizScore: z.number().min(0).max(3).optional(),
  quizPassed: z.boolean().optional(),
  minutesSpent: z.number().optional(),
  slidesCompleted: z.number().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { success } = await apiRateLimit.limit(`progress:${session.user.id}`)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { courseId, lessonId, type, quizScore, quizPassed, minutesSpent, slidesCompleted } = parsed.data
    const userId = session.user.id

    if (type === 'slide_progress' && lessonId && slidesCompleted !== undefined) {
      const progress = await prisma.userProgress.upsert({
        where: { userId_courseId_lessonId: { userId, courseId, lessonId } },
        create: { userId, courseId, lessonId, slidesCompleted },
        update: { slidesCompleted },
      })
      return NextResponse.json({ success: true, progress })
    }

    if (type === 'lesson_complete' && lessonId) {
      const progress = await prisma.userProgress.upsert({
        where: { userId_courseId_lessonId: { userId, courseId, lessonId } },
        create: {
          userId,
          courseId,
          lessonId,
          lessonCompleted: true,
          lessonCompletedAt: new Date(),
          minutesSpent: minutesSpent ?? 0,
        },
        update: {
          lessonCompleted: true,
          lessonCompletedAt: new Date(),
          minutesSpent: { increment: minutesSpent ?? 0 },
        },
      })

      await prisma.user.update({
        where: { id: userId },
        data: { totalLessonsDone: { increment: 1 } },
      })

      const newAchievements = await checkAndUnlockAchievements(userId)
      return NextResponse.json({ success: true, progress, newAchievements })
    }

    if (type === 'quiz_result' && lessonId) {
      const progress = await prisma.userProgress.upsert({
        where: { userId_courseId_lessonId: { userId, courseId, lessonId } },
        create: {
          userId,
          courseId,
          lessonId,
          quizAttempted: true,
          quizPassed: quizPassed ?? false,
          quizScore: quizScore ?? 0,
        },
        update: {
          quizAttempted: true,
          quizPassed: quizPassed ?? false,
          quizScore: quizScore ?? 0,
        },
      })

      const newAchievements = await checkAndUnlockAchievements(userId)
      return NextResponse.json({ success: true, progress, newAchievements })
    }

    if (type === 'course_complete') {
      const existing = await prisma.userProgress.findFirst({
        where: { userId, courseId, lessonId: null },
      })

      let progress
      if (existing) {
        progress = await prisma.userProgress.update({
          where: { id: existing.id },
          data: { courseCompleted: true, courseCompletedAt: new Date() },
        })
      } else {
        progress = await prisma.userProgress.create({
          data: {
            userId,
            courseId,
            courseCompleted: true,
            courseCompletedAt: new Date(),
          },
        })
      }

      return NextResponse.json({ success: true, progress })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
