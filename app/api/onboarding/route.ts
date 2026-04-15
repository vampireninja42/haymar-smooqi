import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const onboardingSchema = z.object({
  topicIds: z.array(z.string()).min(1).max(5),
  dailyGoal: z.number().min(5).max(20),
  notificationsEnabled: z.boolean(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = onboardingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { topicIds, notificationsEnabled } = parsed.data

    // Create topic selections
    await prisma.userTopicSelection.createMany({
      data: topicIds.map((topicId, index) => ({
        userId: session.user.id,
        topicId,
        position: index + 1,
      })),
      skipDuplicates: true,
    })

    // Update user notifications preference
    await prisma.user.update({
      where: { id: session.user.id },
      data: { notificationsEnabled },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
