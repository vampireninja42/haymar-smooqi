import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function AboutSmooqiPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">About Smooqi</h1>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Our Mission</h2>
          <p className="mt-2 text-gray-600 leading-7">
            Smooqi exists to make learning a daily habit, not a guilty obligation. We
            believe everyone deserves bite-sized, engaging lessons that fit into the busiest
            of days.
          </p>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <h2 className="text-lg font-semibold text-gray-900">How It Works</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          {
            step: '1',
            icon: '\u{1F3AF}',
            title: 'Pick Interests',
            desc: 'Choose from 15 topics that spark your curiosity.',
          },
          {
            step: '2',
            icon: '\u{1F4D6}',
            title: 'Daily Lesson',
            desc: 'Swipe through bite-sized slides in under 10 minutes.',
          },
          {
            step: '3',
            icon: '\u{1F3C6}',
            title: 'Quiz + Gamification',
            desc: 'Test your knowledge, earn XP, and climb the leaderboard.',
          },
        ].map((s) => (
          <Card key={s.step}>
            <CardContent className="p-5 text-center">
              <span className="text-3xl">{s.icon}</span>
              <p className="mt-2 font-semibold text-gray-900">{s.title}</p>
              <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-2xl font-bold text-gray-900">
            15 topics &middot; 195+ lessons
          </p>
          <p className="mt-2 text-gray-500">
            And we&apos;re adding more every week.
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Link href="/pricing">
          <Button className="rounded-full px-8">View Plans &amp; Pricing</Button>
        </Link>
      </div>
    </div>
  )
}
