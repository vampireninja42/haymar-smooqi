import { PricingCards } from './PricingCards'

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Try free for 7 days. No credit card required.
        </p>
      </div>

      <PricingCards />
    </div>
  )
}
