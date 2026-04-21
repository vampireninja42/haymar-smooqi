import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/home"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
      <p className="mt-2 text-xs uppercase tracking-widest text-gray-400">
        Last updated: April 2026
      </p>

      <div className="prose prose-sm mt-8 max-w-none text-gray-700">
        <h2 className="mt-8 text-lg font-semibold text-gray-900">
          1. The service
        </h2>
        <p>
          Smooqi is an educational app that delivers short lessons, quizzes,
          and word games. We do our best to keep the content accurate, but
          we&apos;re not a substitute for professional advice in any field.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">
          2. Your account
        </h2>
        <p>
          You need a valid email to create an account. Keep your login
          credentials safe — you&apos;re responsible for activity on your
          account. One person, one account.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">
          3. Acceptable use
        </h2>
        <p>
          Don&apos;t try to break the service, scrape our content, or abuse
          other users. Don&apos;t use Smooqi for anything illegal. We can
          suspend accounts that violate these basics.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">
          4. Subscriptions & billing
        </h2>
        <p>
          Premium is billed through Stripe on the cadence you selected
          (monthly or annually). It renews automatically until you cancel.
          Cancel anytime from Settings → Subscription; you keep Premium until
          the end of the paid period. We don&apos;t offer prorated refunds for
          partial periods unless required by law.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">
          5. Termination
        </h2>
        <p>
          You can delete your account anytime by emailing{' '}
          <a
            href="mailto:hello@haymar.ai"
            className="text-[var(--color-primary)] hover:underline"
          >
            hello@haymar.ai
          </a>
          . We can terminate accounts that violate these terms or pose a
          security risk.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">
          6. Limitation of liability
        </h2>
        <p>
          The service is provided &quot;as is.&quot; To the extent the law
          allows, Haymar isn&apos;t liable for indirect or consequential
          damages arising from use of the service. Our total liability to you
          won&apos;t exceed what you paid us in the 12 months before the
          event.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">
          7. Changes
        </h2>
        <p>
          We may update these terms as the product evolves. If we make
          material changes, we&apos;ll note the new date at the top of the
          page and let active users know by email.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">
          8. Contact
        </h2>
        <p>
          Email{' '}
          <a
            href="mailto:hello@haymar.ai"
            className="text-[var(--color-primary)] hover:underline"
          >
            hello@haymar.ai
          </a>{' '}
          with questions.
        </p>
      </div>
    </div>
  )
}
