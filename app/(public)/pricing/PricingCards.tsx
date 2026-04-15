'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    accent: 'border-gray-200',
    buttonVariant: 'outline' as const,
    buttonLabel: 'Get Started',
    href: '/signup',
    features: [
      'Access to beginner courses',
      'XP & leveling system',
      'Daily streaks',
      'Word games',
      'Community leaderboard',
    ],
  },
  {
    name: 'Monthly',
    price: '$9.99',
    period: '/month',
    description: 'Full access, cancel anytime',
    accent: 'border-purple-300',
    buttonVariant: 'default' as const,
    buttonLabel: 'Start Free Trial',
    plan: 'monthly' as const,
    features: [
      'Everything in Free',
      'All intermediate & advanced courses',
      'Spaced repetition reviews',
      'Priority support',
      'Ad-free experience',
    ],
  },
  {
    name: 'Annual',
    price: '$59.99',
    period: '/year',
    description: 'Best value for committed learners',
    accent: 'border-purple-500 ring-2 ring-purple-500/20',
    buttonVariant: 'default' as const,
    buttonLabel: 'Start Free Trial',
    plan: 'annual' as const,
    popular: true,
    features: [
      'Everything in Monthly',
      'Save 50% vs. monthly',
      'Early access to new courses',
      'Exclusive achievements',
      'Premium support',
    ],
  },
]

export function PricingCards() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(plan: 'monthly' | 'annual') {
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        router.push('/login')
      }
    } catch {
      router.push('/login')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {plans.map((p) => (
        <Card
          key={p.name}
          className={cn(
            'relative flex flex-col border-2 transition-shadow hover:shadow-lg',
            p.accent
          )}
        >
          {p.popular && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white">
              Most Popular &mdash; Save 50%
            </Badge>
          )}
          <CardHeader className="text-center">
            <CardTitle className="text-lg font-semibold">{p.name}</CardTitle>
            <div className="mt-2">
              <span className="text-4xl font-bold text-gray-900">{p.price}</span>
              <span className="text-sm text-gray-500">{p.period}</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{p.description}</p>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <ul className="space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {p.plan ? (
                <Button
                  variant={p.buttonVariant}
                  className="w-full rounded-full"
                  disabled={loading !== null}
                  onClick={() => handleCheckout(p.plan!)}
                >
                  {loading === p.plan ? 'Redirecting...' : p.buttonLabel}
                </Button>
              ) : (
                <Button
                  variant={p.buttonVariant}
                  className="w-full rounded-full"
                  onClick={() => router.push(p.href!)}
                >
                  {p.buttonLabel}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
