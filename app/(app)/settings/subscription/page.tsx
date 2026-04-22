import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { themeConfig } from '@/lib/theme'
import { Badge } from '@/components/ui/badge'
import { SubscriptionActions } from './SubscriptionActions'
import { BackButton } from '@/components/ui/BackButton'

export const dynamic = 'force-dynamic'

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  const userId = session.user.id

  const params = await searchParams
  const showSuccess = params.success === 'true'

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      subscriptionPlan: true,
      trialEndsAt: true,
      subscriptionEndsAt: true,
    },
  })

  if (!user) redirect('/login')

  const status = user.subscriptionStatus
  const plan = user.subscriptionPlan

  // Calculate trial days remaining
  let trialDaysRemaining = 0
  if (status === 'trialing' && user.trialEndsAt) {
    const diff = new Date(user.trialEndsAt).getTime() - Date.now()
    trialDaysRemaining = Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0)
  }

  // Next billing date
  const nextBillingDate = user.subscriptionEndsAt
    ? new Date(user.subscriptionEndsAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <BackButton href="/settings" />
      <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>

      {/* Success banner */}
      {showSuccess && (
        <div className="rounded-[var(--card-radius)] border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-sm font-medium text-green-800">
            Welcome to Premium!
          </p>
        </div>
      )}

      {/* Subscription status card */}
      <div
        className={`rounded-[var(--card-radius)] p-6 shadow-sm ${
          themeConfig.isVA ? 'glass-card' : 'bg-white'
        }`}
      >
        {status === 'free' && (
          <>
            <div className="flex items-center gap-3">
              <Badge className="bg-gray-100 text-gray-600 border-0">
                Trial Expired
              </Badge>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Your free trial has ended. Subscribe to continue learning.
            </p>
            <SubscriptionActions action="upgrade" />
          </>
        )}

        {status === 'trialing' && (
          <>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800 border-0">
                Free Trial
              </Badge>
              <span className="text-sm font-medium text-gray-600">
                {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} remaining
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              You are currently on a free trial. Your trial will end on{' '}
              {user.trialEndsAt
                ? new Date(user.trialEndsAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'soon'}
              .
            </p>
            <SubscriptionActions action="manage" />
          </>
        )}

        {status === 'active' && (
          <>
            <div className="flex items-center gap-3">
              <Badge className="bg-amber-100 text-amber-800 border-0">
                Premium
              </Badge>
              {plan && (
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {plan}
                </span>
              )}
            </div>
            {nextBillingDate && (
              <p className="mt-3 text-sm text-gray-600">
                Next billing date: {nextBillingDate}
              </p>
            )}
            <SubscriptionActions action="manage" />
          </>
        )}

        {status === 'canceled' && (
          <>
            <div className="flex items-center gap-3">
              <Badge className="bg-red-100 text-red-700 border-0">Canceled</Badge>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Your subscription has been canceled.
              {user.subscriptionEndsAt && (
                <>
                  {' '}You still have access until{' '}
                  {new Date(user.subscriptionEndsAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  .
                </>
              )}
            </p>
            <SubscriptionActions action="resubscribe" />
          </>
        )}
      </div>

      {/* Plan comparison (for free users) */}
      {status === 'free' && (
        <div
          className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
            themeConfig.isVA ? 'glass-card' : 'bg-white'
          }`}
        >
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Premium Benefits
          </h3>
          <ul className="space-y-2">
            {[
              'Access all courses and topics',
              'Unlimited quizzes and reviews',
              'Advanced learning analytics',
              'Priority support',
              'No ads',
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500">&#10003;</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
