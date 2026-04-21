import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { apiRateLimit } from '@/lib/rateLimit'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const schema = z.object({
  rating: z.number().int().min(1).max(5),
  message: z.string().max(2000).optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { success } = await apiRateLimit.limit(`feedback:${session.user.id}`)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { rating, message } = parsed.data
    const userEmail = session.user.email ?? 'unknown'

    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Smooqi Feedback <support@haymar.ai>',
        to: 'hello@haymar.ai',
        subject: `App rating: ${rating}/5 from ${userEmail}`,
        html: `
          <p><strong>Rating:</strong> ${rating} / 5</p>
          <p><strong>User:</strong> ${userEmail}</p>
          ${message ? `<p><strong>Message:</strong><br/>${message.replace(/</g, '&lt;')}</p>` : '<p><em>No message provided.</em></p>'}
        `,
      })
    } catch (err) {
      console.error('[Feedback] Email failed:', err)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
