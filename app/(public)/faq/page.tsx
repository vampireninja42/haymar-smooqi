import Link from 'next/link'

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: 'What is Smooqi?',
    a: 'Smooqi is a bite-sized learning app that turns short reads, quizzes, and word games into a daily habit. Pick topics you care about, earn XP, keep your streak going.',
  },
  {
    q: 'How does a lesson work?',
    a: 'Each lesson is a handful of short slides you can read or listen to, followed by a quick quiz to lock in what you learned. Most lessons take under 5 minutes.',
  },
  {
    q: 'How do streaks work?',
    a: 'Finish at least one lesson in a day to extend your streak. Miss a day and the streak resets to zero — your best streak stays on your profile forever.',
  },
  {
    q: 'What is Smooqi Premium?',
    a: 'Premium unlocks every course in the library, removes lesson limits, and supports the team. Free users still get a steady stream of lessons across core topics.',
  },
  {
    q: 'How do I cancel Premium?',
    a: 'Open Settings → Subscription and hit Manage. That opens the Stripe billing portal where you can cancel anytime. You keep access until the end of the current period.',
  },
  {
    q: 'How does the referral program work?',
    a: 'Share your referral link from the Invite page. When a friend signs up and completes their first lesson, you both get 7 days of Premium, plus a small XP bonus.',
  },
  {
    q: 'How do I change the topics I see?',
    a: 'Head to your Profile and tap "+ Add topics" on the Topics card. Pick up to 5 — your home feed and recommendations update immediately.',
  },
  {
    q: 'How do I contact support?',
    a: 'Use the feedback page in-app, or email hello@haymar.ai. We read every message.',
  },
]

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/home"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Can&apos;t find what you need? Email{' '}
        <a
          href="mailto:hello@haymar.ai"
          className="text-[var(--color-primary)] hover:underline"
        >
          hello@haymar.ai
        </a>
        .
      </p>

      <div className="mt-8 space-y-4">
        {FAQS.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-xl border border-gray-200 bg-white px-5 py-4"
          >
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-gray-900 marker:hidden">
              {q}
              <span className="ml-4 text-gray-400 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
