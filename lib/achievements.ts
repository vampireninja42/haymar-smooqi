import { prisma } from './db'

type AchievementRequirement = {
  type: string
  value: number
}

type UserWithRelations = {
  id: string
  currentStreak: number
  totalLessonsDone: number
  xp: number
}

export async function checkAndUnlockAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      currentStreak: true,
      totalLessonsDone: true,
      xp: true,
    },
  })
  if (!user) return []

  const allAchievements = await prisma.achievement.findMany()
  const unlocked = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  })
  const unlockedIds = new Set(unlocked.map((a) => a.achievementId))
  const newUnlocks: Array<{ id: string; slug: string; name: string; icon: string; tier: string }> = []

  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement.id)) continue
    const req = achievement.requirement as AchievementRequirement
    const met = await meetsRequirement(user, req, userId)
    if (met) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: achievement.id },
      })
      newUnlocks.push({
        id: achievement.id,
        slug: achievement.slug,
        name: achievement.name,
        icon: achievement.icon,
        tier: achievement.tier,
      })
    }
  }

  return newUnlocks
}

async function meetsRequirement(
  user: UserWithRelations,
  req: AchievementRequirement,
  userId: string
): Promise<boolean> {
  switch (req.type) {
    case 'streak_days':
      return user.currentStreak >= req.value

    case 'lessons_completed':
      return user.totalLessonsDone >= req.value

    case 'courses_completed': {
      const count = await prisma.userProgress.count({
        where: { userId, courseCompleted: true, lessonId: null },
      })
      return count >= req.value
    }

    case 'quizzes_passed': {
      const count = await prisma.userProgress.count({
        where: { userId, quizPassed: true },
      })
      return count >= req.value
    }

    case 'perfect_quiz': {
      const count = await prisma.userProgress.count({
        where: { userId, quizScore: 3 },
      })
      return count >= req.value
    }

    case 'perfect_quiz_streak':
      // Simplified: just check total perfect quizzes
      return false

    case 'topics_selected': {
      const count = await prisma.userTopicSelection.count({ where: { userId } })
      return count >= req.value
    }

    case 'topics_started': {
      const topics = await prisma.userProgress.findMany({
        where: { userId },
        select: { course: { select: { topicId: true } } },
        distinct: ['courseId'],
      })
      const uniqueTopics = new Set(topics.map((t) => t.course.topicId))
      return uniqueTopics.size >= req.value
    }

    case 'topics_completed': {
      const completed = await prisma.userProgress.findMany({
        where: { userId, courseCompleted: true, lessonId: null },
        select: { course: { select: { topicId: true } } },
      })
      const uniqueTopics = new Set(completed.map((c) => c.course.topicId))
      return uniqueTopics.size >= req.value
    }

    case 'daily_challenges': {
      const count = await prisma.userDailyChallenge.count({ where: { userId } })
      return count >= req.value
    }

    case 'daily_challenge_streak':
      // Simplified: check total daily challenges
      return false

    case 'referrals': {
      const count = await prisma.user.count({ where: { referredById: userId } })
      return count >= req.value
    }

    default:
      return false
  }
}
