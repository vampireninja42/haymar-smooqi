import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { updateSM2 } from '@/lib/sm2'

const schema = z.object({
  lessonId: z.string(),
  rating: z.union([z.literal(0), z.literal(1), z.literal(2)]),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { lessonId, rating } = parsed.data
    const userId = session.user.id

    const existing = await prisma.userReview.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    })

    const current = existing
      ? { easeFactor: existing.easeFactor, interval: existing.interval, repetitions: existing.repetitions }
      : { easeFactor: 2.5, interval: 1, repetitions: 0 }

    const updated = updateSM2(current, rating)

    await prisma.userReview.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        easeFactor: updated.easeFactor,
        interval: updated.interval,
        repetitions: updated.repetitions,
        nextReviewAt: updated.nextReviewAt,
      },
      update: {
        easeFactor: updated.easeFactor,
        interval: updated.interval,
        repetitions: updated.repetitions,
        nextReviewAt: updated.nextReviewAt,
      },
    })

    return NextResponse.json({ success: true, nextReviewAt: updated.nextReviewAt })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
