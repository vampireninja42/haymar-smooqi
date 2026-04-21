import { prisma } from '@/lib/db'
import { generateReferralCode } from '@/lib/utils'
import { signupRateLimit } from '@/lib/rateLimit'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email').max(255, 'Email too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password too long'),
  ref: z.string().max(50).optional(),
})

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const { success } = await signupRateLimit.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = signupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { name, email, password, ref } = parsed.data
    const normalizedEmail = email.toLowerCase()

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json({ error: { email: ['Email already registered'] } }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    let referredById: string | undefined
    if (ref) {
      const referrer = await prisma.user.findFirst({ where: { referralCode: ref } })
      if (referrer) {
        referredById = referrer.id
        // Grant 7 days premium trial to referrer — but only if they referred
        // someone new (not already on an active/trialing paid plan), and only
        // extend if their current trial hasn't already been set by this path.
        // Abuse guard: check they haven't already referred this email before.
        const alreadyReferred = await prisma.user.findFirst({
          where: { referredById: referrer.id, email: normalizedEmail },
        })
        if (!alreadyReferred) {
          const newTrialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          // Only grant/extend if not already on a paid active subscription
          if (referrer.subscriptionStatus !== 'active') {
            await prisma.user.update({
              where: { id: referrer.id },
              data: {
                subscriptionStatus: 'trialing',
                // Don't shorten an existing trial — take the later date
                trialEndsAt: referrer.trialEndsAt && referrer.trialEndsAt > newTrialEnd
                  ? referrer.trialEndsAt
                  : newTrialEnd,
              },
            })
          }
        }
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        referralCode: generateReferralCode(),
        referredById,
        ...(referredById ? {
          subscriptionStatus: 'trialing',
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        } : {}),
      },
    })

    return NextResponse.json({ id: user.id, email: user.email })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
