import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/home"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-xs uppercase tracking-widest text-gray-400">
        Last updated: April 2026
      </p>

      <div className="prose prose-sm mt-8 max-w-none text-gray-700">
        <h2 className="mt-8 text-lg font-semibold text-gray-900">Who we are</h2>
        <p>
          Smooqi is a product of Haymar. When we say &quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot; in this policy, we mean Haymar.
          You can reach us at{' '}
          <a
            href="mailto:hello@haymar.ai"
            className="text-[var(--color-primary)] hover:underline"
          >
            hello@haymar.ai
          </a>
          .
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">
          What we collect
        </h2>
        <ul className="list-disc pl-5">
          <li>
            <strong>Account info:</strong> your email address, display name,
            and profile image if you sign in with Google.
          </li>
          <li>
            <strong>Learning activity:</strong> which lessons and quizzes you
            complete, your XP, streaks, and topic preferences — everything
            needed to make the app actually useful.
          </li>
          <li>
            <strong>Device basics:</strong> browser type, IP, and rough
            location for rate limiting and abuse prevention.
          </li>
          <li>
            <strong>Billing info:</strong> if you subscribe, Stripe stores
            your payment details. We never see your card number.
          </li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">
          How we use it
        </h2>
        <p>
          To run the product: render your dashboard, track streaks, deliver
          notifications you opt into, and charge you when you subscribe. We do
          not sell personal data. We do not share it with advertisers.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">
          Third parties we rely on
        </h2>
        <ul className="list-disc pl-5">
          <li>
            <strong>Google OAuth</strong> — for sign-in, if you choose it.
          </li>
          <li>
            <strong>Stripe</strong> — for payments and subscription
            management.
          </li>
          <li>
            <strong>Upstash</strong> — for rate limiting.
          </li>
          <li>
            <strong>Resend</strong> — for transactional email.
          </li>
        </ul>
        <p>
          Each of these processors holds data only for the specific purpose
          above.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">
          Retention
        </h2>
        <p>
          We keep your account data until you delete your account. Email us at{' '}
          <a
            href="mailto:hello@haymar.ai"
            className="text-[var(--color-primary)] hover:underline"
          >
            hello@haymar.ai
          </a>{' '}
          and we&apos;ll remove your data within 30 days.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">Contact</h2>
        <p>
          Questions, concerns, or requests? Email{' '}
          <a
            href="mailto:hello@haymar.ai"
            className="text-[var(--color-primary)] hover:underline"
          >
            hello@haymar.ai
          </a>
          .
        </p>
      </div>
    </div>
  )
}
