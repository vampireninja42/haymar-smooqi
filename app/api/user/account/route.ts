import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    await prisma.$transaction([
      prisma.userXPLog.deleteMany({ where: { userId } }),
      prisma.userAchievement.deleteMany({ where: { userId } }),
      prisma.userDailyChallenge.deleteMany({ where: { userId } }),
      prisma.userProgress.deleteMany({ where: { userId } }),
      prisma.userTopicSelection.deleteMany({ where: { userId } }),
      prisma.userSavedCourse.deleteMany({ where: { userId } }),
      prisma.userReview.deleteMany({ where: { userId } }),
      prisma.supportRequest.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ])

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
