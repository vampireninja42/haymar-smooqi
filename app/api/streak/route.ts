import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { toZonedTime, format } from 'date-fns-tz'

function getTodayPacific(): string {
  return format(toZonedTime(new Date(), 'America/Los_Angeles'), 'yyyy-MM-dd')
}

function getDatePacific(date: Date): string {
  return format(toZonedTime(date, 'America/Los_Angeles'), 'yyyy-MM-dd')
}

function getYesterdayPacific(): string {
  const now = new Date()
  now.setDate(now.getDate() - 1)
  return format(toZonedTime(now, 'America/Los_Angeles'), 'yyyy-MM-dd')
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lastActiveDate: true, currentStreak: true, bestStreak: true },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const today = getTodayPacific()
    const yesterday = getYesterdayPacific()
    const lastActive = user.lastActiveDate ? getDatePacific(user.lastActiveDate) : null

    if (lastActive === today) {
      return NextResponse.json({
        success: true,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        streakIncremented: false,
      })
    }

    let newStreak: number
    if (lastActive === yesterday) {
      newStreak = user.currentStreak + 1
    } else {
      newStreak = 1
    }

    const newBest = Math.max(newStreak, user.bestStreak)

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        currentStreak: newStreak,
        bestStreak: newBest,
        lastActiveDate: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      currentStreak: newStreak,
      bestStreak: newBest,
      streakIncremented: true,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
