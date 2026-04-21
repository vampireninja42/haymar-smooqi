import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const ITEMS_PER_PAGE = 12

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  const { searchParams } = req.nextUrl
  const q = searchParams.get('q') ?? ''
  const topicFilter = searchParams.get('topic') ?? ''
  const levelFilter = searchParams.get('level') ?? ''
  const accessFilter = searchParams.get('access') ?? ''
  const sort = searchParams.get('sort') ?? 'popular'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (topicFilter) where.topic = { slug: topicFilter }
  if (levelFilter) where.level = levelFilter
  if (accessFilter === 'free') where.isFree = true
  if (accessFilter === 'premium') where.isFree = false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = [{ sortOrder: 'asc' }]
  if (sort === 'newest') orderBy = [{ id: 'desc' }]
  if (sort === 'level') orderBy = [{ level: 'asc' }, { sortOrder: 'asc' }]

  const skip = (page - 1) * ITEMS_PER_PAGE
  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      orderBy,
      skip,
      take: ITEMS_PER_PAGE,
      include: { topic: { select: { slug: true, name: true, icon: true } } },
    }),
    prisma.course.count({ where }),
  ])

  const savedCourses = await prisma.userSavedCourse.findMany({
    where: { userId },
    select: { courseId: true },
  })
  const savedIds = new Set(savedCourses.map((s) => s.courseId))

  return NextResponse.json({
    courses: courses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description,
      level: c.level,
      lessonCount: c.lessonCount,
      estimatedMinutes: c.estimatedMinutes,
      isFree: c.isFree,
      topic: c.topic,
      isSaved: savedIds.has(c.id),
    })),
    hasMore: skip + courses.length < total,
    total,
  })
}
