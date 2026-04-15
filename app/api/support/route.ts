import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  issueType: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { issueType, email, subject, description } = parsed.data

    const supportRequest = await prisma.supportRequest.create({
      data: {
        userId: session?.user?.id ?? null,
        email,
        issueType,
        subject,
        description,
      },
    })

    // TODO: Send confirmation email via Resend
    console.log(`[Support] New request ${supportRequest.id}: ${issueType} - ${subject}`)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
