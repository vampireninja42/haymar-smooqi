import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const existingSelections = await prisma.userTopicSelection.findFirst({
    where: { userId: session.user.id },
  })

  if (existingSelections) {
    redirect('/home')
  }

  const topics = await prisma.topic.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      icon: true,
      colorHex: true,
      _count: { select: { courses: true } },
    },
    orderBy: { sortOrder: 'asc' },
  })

  return <OnboardingShell topics={topics} />
}
