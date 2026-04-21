import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const schema = z.object({
  issueType: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { issueType, email, subject, description } = parsed.data

    await prisma.supportRequest.create({
      data: {
        userId: session?.user?.id ?? null,
        email,
        issueType,
        subject,
        description,
      },
    })

    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Smooqi Support <support@haymar.ai>',
        to: email,
        subject: `We received your message: ${subject}`,
        html: `
          <p>Hi,</p>
          <p>Thanks for reaching out. We received your support request and will get back to you within 24 hours.</p>
          <p><strong>Your message:</strong><br/>${description}</p>
          <p>— The Smooqi Team</p>
        `,
      })
    } catch (err) {
      console.error('[Support] Confirmation email failed:', err)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
