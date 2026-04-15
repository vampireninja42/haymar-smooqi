import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ReviewCards } from './ReviewCards'

export const dynamic = 'force-dynamic'

export default async function ReviewPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const now = new Date()

  const dueReviews = await prisma.userReview.findMany({
    where: {
      userId: session.user.id,
      nextReviewAt: { lte: now },
    },
    include: {
      lesson: {
        include: {
          slides: {
            orderBy: { slideOrder: 'asc' },
            take: 1,
          },
        },
      },
    },
    orderBy: { nextReviewAt: 'asc' },
  })

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Spaced Repetition Review</h1>
      <p className="mt-1 text-gray-500">
        {dueReviews.length > 0
          ? `${dueReviews.length} lesson${dueReviews.length === 1 ? '' : 's'} to review today`
          : 'No reviews due right now.'}
      </p>

      {dueReviews.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-4xl">&#x1F389;</p>
          <p className="mt-3 text-lg font-semibold text-gray-900">All caught up!</p>
          <p className="mt-1 text-gray-500">Check back tomorrow.</p>
        </div>
      ) : (
        <ReviewCards
          reviews={dueReviews.map((r) => ({
            lessonId: r.lessonId,
            lessonTitle: r.lesson.title,
            slidePreview: r.lesson.slides[0]?.content ?? '',
          }))}
        />
      )}
    </div>
  )
}
