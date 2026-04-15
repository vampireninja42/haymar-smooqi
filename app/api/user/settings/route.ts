import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      provider: true,
      themeColor: true,
      backgroundPattern: true,
      notificationsEnabled: true,
      subscriptionStatus: true,
      subscriptionPlan: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}

const patchSchema = z.object({
  themeColor: z.string().optional(),
  backgroundPattern: z.string().optional(),
  themeMode: z.string().optional(),
  notificationsEnabled: z.boolean().optional(),
})

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const data: Record<string, unknown> = {}
  if (parsed.data.themeColor !== undefined) data.themeColor = parsed.data.themeColor
  if (parsed.data.backgroundPattern !== undefined) data.backgroundPattern = parsed.data.backgroundPattern
  if (parsed.data.notificationsEnabled !== undefined) data.notificationsEnabled = parsed.data.notificationsEnabled

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: true })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  })

  return NextResponse.json({ success: true })
}
