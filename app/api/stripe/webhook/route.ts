import { prisma } from '@/lib/db'
import { redis } from '@/lib/redis'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2024-12-18.acacia' as any,
  })
}

export async function POST(req: Request) {
  const stripe = getStripe()
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotency: skip already-processed events
  const eventId = event.id
  const existing = await redis.get(`stripe:event:${eventId}`)
  if (existing) {
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 })
  }
  await redis.set(`stripe:event:${eventId}`, '1', { ex: 60 * 60 * 24 * 3 })

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const statusMap: Record<string, string> = {
          trialing: 'trialing',
          active: 'active',
          past_due: 'past_due',
          canceled: 'canceled',
          unpaid: 'unpaid',
          incomplete: 'incomplete',
          incomplete_expired: 'expired',
          paused: 'paused',
        }

        const subscriptionStatus = statusMap[subscription.status] ?? subscription.status

        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus,
            subscriptionPlan: subscription.items.data[0]?.price?.id ?? null,
            trialEndsAt: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : null,
            subscriptionEndsAt: subscription.items.data[0]?.current_period_end
              ? new Date(subscription.items.data[0].current_period_end * 1000)
              : null,
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: 'canceled',
            subscriptionPlan: null,
            subscriptionEndsAt: new Date(),
          },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        if (customerId) {
          await prisma.user.update({
            where: { stripeCustomerId: customerId },
            data: { subscriptionStatus: 'past_due' },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
