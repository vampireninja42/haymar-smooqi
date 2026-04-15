import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { NextResponse } from 'next/server'

function getTodayDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = getTodayDate()
    const challenge = await prisma.dailyChallenge.findUnique({
      where: { date: today },
      include: { question: true },
    })

    if (!challenge) {
      return NextResponse.json({ challenge: null, attempt: null })
    }

    const attempt = await prisma.userDailyChallenge.findUnique({
      where: { userId_challengeId: { userId: session.user.id, challengeId: challenge.id } },
    })

    return NextResponse.json({ challenge, attempt })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const submitSchema = z.object({
  challengeId: z.string(),
  selectedAnswer: z.enum(['A', 'B', 'C', 'D']),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = submitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { challengeId, selectedAnswer } = parsed.data
    const userId = session.user.id

    const challenge = await prisma.dailyChallenge.findUnique({
      where: { id: challengeId },
      include: { question: true },
    })
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    const existing = await prisma.userDailyChallenge.findUnique({
      where: { userId_challengeId: { userId, challengeId } },
    })
    if (existing) {
      return NextResponse.json({ error: 'Already answered' }, { status: 400 })
    }

    const isCorrect = selectedAnswer === challenge.question.correctAnswer

    await prisma.userDailyChallenge.create({
      data: { userId, challengeId, selectedAnswer, isCorrect },
    })

    let xpEarned = 0
    if (isCorrect) {
      xpEarned = 10
      await prisma.$transaction([
        prisma.user.update({ where: { id: userId }, data: { xp: { increment: 10 } } }),
        prisma.userXPLog.create({ data: { userId, amount: 10, source: 'daily_challenge', sourceId: challengeId } }),
      ])
    }

    return NextResponse.json({
      isCorrect,
      correctAnswer: challenge.question.correctAnswer,
      explanation: challenge.question.explanation,
      xpEarned,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
