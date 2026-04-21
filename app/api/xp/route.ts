import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getLevelFromXp } from '@/lib/xp'
import { checkAndUnlockAchievements } from '@/lib/achievements'
import { apiRateLimit } from '@/lib/rateLimit'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const schema = z.object({
  amount: z.number().positive(),
  source: z.enum(['lesson_complete', 'quiz_pass', 'streak', 'daily_challenge', 'course_complete']),
  sourceId: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { success } = await apiRateLimit.limit(`xp:${session.user.id}`)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { amount, source, sourceId } = parsed.data
    const userId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const newXp = user.xp + amount
    const newLevel = getLevelFromXp(newXp)
    const levelUp = newLevel > user.level

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { xp: newXp, level: newLevel },
      }),
      prisma.userXPLog.create({
        data: { userId, amount, source, sourceId },
      }),
    ])

    const newAchievements = await checkAndUnlockAchievements(userId)

    return NextResponse.json({
      success: true,
      xpEarned: amount,
      newXp,
      newLevel,
      levelUp,
      newAchievements,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
