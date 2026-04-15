import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getXpForLevel } from '@/lib/xp'
import {
  NotificationPrompts,
  ContinueLearningCard,
  DailyGoalBlock,
  DailyChallengeWidget,
  QuickLinksGrid,
  AchievementsWidget,
  RecommendedCourses,
  LearningPath,
} from '@/components/dashboard'

export const dynamic = 'force-dynamic'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default async function HomePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const userId = session.user.id

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)

  const [
    user,
    continueLesson,
    dailyChallenge,
    achievementCount,
    topicSelections,
    savedCourseIds,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        level: true,
        xp: true,
        currentStreak: true,
        bestStreak: true,
        totalLessonsDone: true,
        totalMinutes: true,
        notificationsEnabled: true,
        subscriptionStatus: true,
      },
    }),
    prisma.userProgress.findFirst({
      where: { userId, lessonCompleted: false, slidesCompleted: { gt: 0 } },
      orderBy: { updatedAt: 'desc' },
      include: { lesson: true, course: true },
    }),
    prisma.dailyChallenge.findUnique({
      where: { date: today },
      include: { question: true },
    }),
    prisma.userAchievement.count({ where: { userId } }),
    prisma.userTopicSelection.findMany({
      where: { userId },
      include: {
        topic: {
          include: {
            courses: {
              orderBy: { sortOrder: 'asc' },
              include: {
                lessons: {
                  orderBy: { sortOrder: 'asc' },
                  select: { id: true, slug: true, title: true, sortOrder: true },
                },
              },
            },
          },
        },
      },
      orderBy: { position: 'asc' },
    }),
    prisma.userSavedCourse.findMany({
      where: { userId },
      select: { courseId: true },
    }),
  ])

  if (!user) redirect('/login')

  // Daily challenge attempt
  let dailyChallengeAttempt = null
  if (dailyChallenge) {
    dailyChallengeAttempt = await prisma.userDailyChallenge.findUnique({
      where: {
        userId_challengeId: { userId, challengeId: dailyChallenge.id },
      },
    })
  }

  // Recommended courses: from selected topics, exclude completed
  const completedCourseIds = (
    await prisma.userProgress.findMany({
      where: { userId, courseCompleted: true, lessonId: null },
      select: { courseId: true },
    })
  ).map((p) => p.courseId)

  const recommendedCourses = await prisma.course.findMany({
    where: {
      topicId: { in: topicSelections.map((ts) => ts.topicId) },
      id: { notIn: completedCourseIds },
    },
    include: { topic: true },
    orderBy: [{ isFree: 'desc' }, { sortOrder: 'asc' }],
    take: 6,
  })

  // Weekly XP data
  const xpLogs = await prisma.userXPLog.findMany({
    where: { userId, createdAt: { gte: sevenDaysAgo } },
    select: { amount: true, createdAt: true },
  })

  // Build weekly data array (last 7 days)
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sevenDaysAgo)
    d.setDate(sevenDaysAgo.getDate() + i)
    const dayStart = new Date(d)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(d)
    dayEnd.setHours(23, 59, 59, 999)
    const dayXp = xpLogs
      .filter((l) => l.createdAt >= dayStart && l.createdAt <= dayEnd)
      .reduce((sum, l) => sum + l.amount, 0)
    return {
      label: DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1],
      minutes: Math.round(dayXp / 2),
    }
  })

  // Count slides for continue lesson
  let totalSlides = 0
  if (continueLesson?.lesson) {
    totalSlides = await prisma.slide.count({
      where: { lessonId: continueLesson.lesson.id },
    })
  }

  const savedIds = savedCourseIds.map((s) => s.courseId)

  const xpForCurrentLevel = getXpForLevel(user.level)
  const xpForNextLevel = getXpForLevel(user.level + 1)
  const xpProgress = user.xp - xpForCurrentLevel
  const xpNeeded = xpForNextLevel - xpForCurrentLevel

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Welcome back, {user.name?.split(' ')[0] ?? 'Learner'}!
        </h1>
        <p className="text-sm text-gray-500">
          Level {user.level} &middot; {xpProgress}/{xpNeeded} XP to next level
        </p>
      </div>

      {/* Notification prompts */}
      <NotificationPrompts
        notificationsEnabled={user.notificationsEnabled}
        totalLessonsDone={user.totalLessonsDone}
      />

      {/* Continue learning */}
      {continueLesson?.lesson && continueLesson.course && (
        <ContinueLearningCard
          courseSlug={continueLesson.course.slug}
          courseTitle={continueLesson.course.title}
          lessonSlug={continueLesson.lesson.slug}
          lessonTitle={continueLesson.lesson.title}
          slidesCompleted={continueLesson.slidesCompleted}
          totalSlides={totalSlides}
        />
      )}

      {/* Daily goal / activity stats */}
      <DailyGoalBlock
        currentStreak={user.currentStreak}
        bestStreak={user.bestStreak}
        totalLessonsDone={user.totalLessonsDone}
        totalMinutes={user.totalMinutes}
        weeklyData={weeklyData}
      />

      {/* Daily challenge */}
      {dailyChallenge && (
        <DailyChallengeWidget
          challengeId={dailyChallenge.id}
          question={dailyChallenge.question.question}
          optionA={dailyChallenge.question.optionA}
          optionB={dailyChallenge.question.optionB}
          optionC={dailyChallenge.question.optionC}
          optionD={dailyChallenge.question.optionD}
          correctAnswer={dailyChallenge.question.correctAnswer}
          explanation={dailyChallenge.question.explanation}
          alreadyAttempted={!!dailyChallengeAttempt}
          previousAnswer={dailyChallengeAttempt?.selectedAnswer}
          wasCorrect={dailyChallengeAttempt?.isCorrect}
        />
      )}

      {/* Quick links */}
      <QuickLinksGrid />

      {/* Achievements */}
      <AchievementsWidget achievementCount={achievementCount} />

      {/* Recommended courses */}
      <RecommendedCourses
        courses={recommendedCourses.map((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          description: c.description,
          level: c.level,
          lessonCount: c.lessonCount,
          estimatedMinutes: c.estimatedMinutes,
          isFree: c.isFree,
          topic: {
            slug: c.topic.slug,
            name: c.topic.name,
            icon: c.topic.icon,
          },
        }))}
        savedCourseIds={savedIds}
      />

      {/* Learning path */}
      <LearningPath
        topicSelections={topicSelections.map((ts) => ({
          topicId: ts.topicId,
          topic: {
            slug: ts.topic.slug,
            name: ts.topic.name,
            icon: ts.topic.icon,
            courses: ts.topic.courses.map((c) => ({
              id: c.id,
              slug: c.slug,
              title: c.title,
              sortOrder: c.sortOrder,
              lessons: c.lessons,
            })),
          },
        }))}
      />
    </div>
  )
}
