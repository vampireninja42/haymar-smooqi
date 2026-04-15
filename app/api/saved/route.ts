import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const schema = z.object({ courseId: z.string() })

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

    const { courseId } = parsed.data
    const userId = session.user.id

    const existing = await prisma.userSavedCourse.findUnique({
      where: { userId_courseId: { userId, courseId } },
    })

    if (existing) {
      await prisma.userSavedCourse.delete({ where: { id: existing.id } })
      return NextResponse.json({ saved: false })
    }

    await prisma.userSavedCourse.create({ data: { userId, courseId } })
    return NextResponse.json({ saved: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
