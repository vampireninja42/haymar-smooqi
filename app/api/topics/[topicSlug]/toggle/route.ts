import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(_req: Request, { params }: { params: { topicSlug: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const topic = await prisma.topic.findUnique({ where: { slug: params.topicSlug } })
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    const existing = await prisma.userTopicSelection.findUnique({
      where: { userId_topicId: { userId, topicId: topic.id } },
    })

    if (existing) {
      await prisma.userTopicSelection.delete({ where: { id: existing.id } })
      const totalSelected = await prisma.userTopicSelection.count({ where: { userId } })
      return NextResponse.json({ added: false, totalSelected })
    }

    const count = await prisma.userTopicSelection.count({ where: { userId } })
    if (count >= 5) {
      return NextResponse.json({ error: 'Maximum 5 topics allowed' }, { status: 400 })
    }

    await prisma.userTopicSelection.create({
      data: { userId, topicId: topic.id, position: count + 1 },
    })

    return NextResponse.json({ added: true, totalSelected: count + 1 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
