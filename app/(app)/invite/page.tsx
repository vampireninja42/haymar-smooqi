import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { CopyReferralLink } from './CopyReferralLink'
import { BackButton } from '@/components/ui/BackButton'

export const dynamic = 'force-dynamic'

export default async function InvitePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      referralCode: true,
      _count: { select: { referrals: true } },
    },
  })

  if (!user) redirect('/login')

  const rewardedCount = await prisma.user.count({
    where: {
      referredById: session.user.id,
      subscriptionStatus: { not: 'free' },
    },
  })

  const referralCode = user.referralCode
  const invitedCount = user._count.referrals

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton href="/home" />
      <h1 className="text-2xl font-bold text-gray-900">Invite Friends, Learn Together</h1>
      <p className="mt-1 text-gray-500">
        Share Smooqi with friends and both of you get rewarded.
      </p>

      {/* How it works */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { step: '1', icon: '\u{1F4E8}', title: 'Share', desc: 'Send your referral link to friends' },
          { step: '2', icon: '\u{1F44B}', title: 'Sign Up', desc: 'They create a free account' },
          { step: '3', icon: '\u{1F381}', title: 'Both Get Premium', desc: 'You both unlock Premium access' },
        ].map((s) => (
          <Card key={s.step} className="text-center">
            <CardContent className="p-5">
              <span className="text-3xl">{s.icon}</span>
              <p className="mt-2 font-semibold text-gray-900">{s.title}</p>
              <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referral code + copy */}
      <div className="mt-8">
        <CopyReferralLink code={referralCode} />
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-purple-600">{invitedCount}</p>
            <p className="mt-1 text-sm text-gray-500">Friends Invited</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-green-600">{rewardedCount}</p>
            <p className="mt-1 text-sm text-gray-500">Rewards Earned</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
