import Link from 'next/link'
import { themeConfig } from '@/lib/theme'
import { CourseCard } from '@/components/course/CourseCard'
import { DailyChallengeWidget } from './DailyChallengeWidget'
import { DailyGoalBlock } from './DailyGoalBlock'

interface VbDashboardProps {
  user: {
    name: string | null
    level: number
    xp: number
    currentStreak: number
    bestStreak: number
    totalLessonsDone: number
    totalMinutes: number
    notificationsEnabled: boolean
    subscriptionStatus: string | null
  }
  continueLesson: {
    lesson: { id: string; slug: string; title: string } | null
    course: { id: string; slug: string; title: string } | null
  } | null
  dailyChallenge: {
    id: string
    question: {
      question: string
      optionA: string
      optionB: string
      optionC: string
      optionD: string
      correctAnswer: string
      explanation?: string | null
    }
  } | null
  dailyChallengeAttempt: {
    selectedAnswer: string
    isCorrect: boolean
  } | null
  achievementCount: number
  topicSelections: Array<{
    topicId: string
    topic: {
      slug: string
      name: string
      icon: string
      courses: Array<{
        id: string
        slug: string
        title: string
        sortOrder: number
        lessons: Array<{ id: string; slug: string; title: string; sortOrder: number }>
      }>
    }
  }>
  recommendedCourses: Array<{
    id: string
    slug: string
    title: string
    description: string
    level: string
    lessonCount: number
    estimatedMinutes: number
    isFree: boolean
    topic: { slug: string; name: string; icon: string }
  }>
  savedIds: string[]
  weeklyData: Array<{ day: string; minutes: number; isToday: boolean }>
  xpProgress: number
  xpNeeded: number
  xpInLevel: number
}

const DIVIDER_COLOR = '#E8E4DC'

const QUICK_LINKS = [
  { label: 'Explore', href: '/explore' },
  { label: 'Word Games', href: '/word-games' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Reports', href: '/reports' },
  { label: 'Invite Friends', href: '/invite' },
]

export function VbDashboard({
  user,
  continueLesson,
  dailyChallenge,
  dailyChallengeAttempt,
  achievementCount,
  topicSelections,
  recommendedCourses,
  savedIds,
  weeklyData,
}: VbDashboardProps) {
  const now = new Date()
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' })
  const fullDate = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-2xl">
      {/* ── Section 1: Date Masthead ─────────────────────────── */}
      <div className="pt-2 pb-6 border-b" style={{ borderColor: DIVIDER_COLOR }}>
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: '#A8A29E' }}
        >
          {weekday}
        </p>
        <h1
          className="text-3xl font-bold leading-tight"
          style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
        >
          {fullDate}
        </h1>

        {/* 7-day streak strip */}
        <div className="mt-4 flex items-center gap-2">
          <VbStreakStrip streak={user.currentStreak} weeklyData={weeklyData} />
        </div>
      </div>

      {/* ── Section 2: Continue Reading (hero) ───────────────── */}
      {continueLesson?.lesson && continueLesson.course && (
        <div className="py-6 border-b" style={{ borderColor: DIVIDER_COLOR }}>
          <p
            className="text-[10px] uppercase tracking-widest font-semibold mb-3"
            style={{ color: '#A8A29E' }}
          >
            Continue Reading
          </p>
          <Link
            href={`/learn/${continueLesson.course.slug}/${continueLesson.lesson.slug}`}
            className="block p-6 rounded-[10px] border transition-shadow hover:shadow-md"
            style={{
              borderColor: DIVIDER_COLOR,
              background: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
            }}
          >
            <h2
              className="text-2xl font-bold leading-snug mb-2"
              style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
            >
              {continueLesson.lesson.title}
            </h2>
            <p className="text-sm mb-5" style={{ color: '#57534E' }}>
              {continueLesson.course.title}
            </p>
            <span
              className="inline-block px-5 py-2.5 text-sm font-semibold"
              style={{ background: '#1A6B4A', color: '#FFFFFF', borderRadius: '8px' }}
            >
              Pick up where you left off →
            </span>
          </Link>
        </div>
      )}

      {/* ── Section 3: Today's Challenge ─────────────────────── */}
      {dailyChallenge && (
        <div className="py-6 border-b" style={{ borderColor: DIVIDER_COLOR }}>
          <p
            className="text-[10px] uppercase tracking-widest font-semibold mb-3"
            style={{ color: '#A8A29E' }}
          >
            Today&apos;s Challenge
          </p>
          <DailyChallengeWidget
            challenge={{ id: dailyChallenge.id, question: dailyChallenge.question }}
            existingAttempt={
              dailyChallengeAttempt
                ? {
                    selectedAnswer: dailyChallengeAttempt.selectedAnswer,
                    isCorrect: dailyChallengeAttempt.isCorrect,
                  }
                : null
            }
          />
        </div>
      )}

      {/* ── Section 4: Your Path ─────────────────────────────── */}
      {topicSelections.length > 0 && (
        <div className="py-6 border-b" style={{ borderColor: DIVIDER_COLOR }}>
          <p
            className="text-[10px] uppercase tracking-widest font-semibold mb-4"
            style={{ color: '#A8A29E' }}
          >
            Your Path
          </p>
          <div className="space-y-4">
            {topicSelections.map((ts) => {
              const colors = themeConfig.topicColors[ts.topic.slug] ?? {
                bg: '#F3F4F6',
                text: '#374151',
              }
              const totalCourses = ts.topic.courses.length
              const firstCourse = ts.topic.courses[0]
              const previewLessons = firstCourse?.lessons.slice(0, 3) ?? []

              return (
                <div key={ts.topicId}>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded text-sm flex-shrink-0"
                      style={{ background: colors.bg, color: colors.text }}
                    >
                      {ts.topic.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
                      >
                        {ts.topic.name}
                      </p>
                      <p className="text-xs" style={{ color: '#A8A29E' }}>
                        {totalCourses} course{totalCourses !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Link
                      href={`/topics/${ts.topic.slug}`}
                      className="text-xs flex-shrink-0"
                      style={{ color: '#1A6B4A' }}
                    >
                      See all →
                    </Link>
                  </div>

                  {previewLessons.length > 0 && firstCourse && (
                    <div
                      className="ml-11 border-l-2 pl-4 space-y-1.5"
                      style={{ borderColor: DIVIDER_COLOR }}
                    >
                      {previewLessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/learn/${firstCourse.slug}/${lesson.slug}`}
                          className="block text-sm transition-colors hover:underline"
                          style={{ color: '#57534E' }}
                        >
                          {lesson.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Section 5: From Your Library (recommended) ───────── */}
      {recommendedCourses.length > 0 && (
        <div className="py-6 border-b" style={{ borderColor: DIVIDER_COLOR }}>
          <p
            className="text-[10px] uppercase tracking-widest font-semibold mb-4"
            style={{ color: '#A8A29E' }}
          >
            From Your Library
          </p>
          <div className="grid grid-cols-2 gap-4">
            {recommendedCourses.slice(0, 4).map((course) => (
              <CourseCard
                key={course.id}
                course={{
                  id: course.id,
                  slug: course.slug,
                  title: course.title,
                  description: course.description,
                  level: course.level,
                  lessonCount: course.lessonCount,
                  estimatedMinutes: course.estimatedMinutes,
                  isFree: course.isFree,
                  topic: {
                    slug: course.topic.slug,
                    name: course.topic.name,
                    icon: course.topic.icon,
                  },
                }}
                isSaved={savedIds.includes(course.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Section 6: Activity ──────────────────────────────── */}
      <div className="py-6 border-b" style={{ borderColor: DIVIDER_COLOR }}>
        <p
          className="text-[10px] uppercase tracking-widest font-semibold mb-3"
          style={{ color: '#A8A29E' }}
        >
          Activity
        </p>
        <DailyGoalBlock
          minutesStudied={user.totalMinutes}
          dailyGoal={15}
          streak={user.currentStreak}
          level={user.level}
          xp={user.xp}
          weeklyData={weeklyData}
        />
      </div>

      {/* ── Section 7: Quick Links ───────────────────────────── */}
      <div className="py-6 border-b" style={{ borderColor: DIVIDER_COLOR }}>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-[#1A6B4A] hover:underline"
              style={{ color: '#57534E' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Section 8: Achievements footer ───────────────────── */}
      <div className="py-6">
        <Link
          href="/achievements"
          className="text-sm transition-colors hover:underline"
          style={{ color: '#A8A29E' }}
        >
          {achievementCount} of 29 achievements collected →
        </Link>
      </div>
    </div>
  )
}

// ─── 7-day streak strip (inline, server-rendered) ───────────

function VbStreakStrip({
  streak,
  weeklyData,
}: {
  streak: number
  weeklyData: Array<{ day: string; minutes: number; isToday: boolean }>
}) {
  return (
    <div className="flex items-center gap-1.5">
      {weeklyData.map((day, i) => {
        const active = day.minutes > 0
        const isToday = day.isToday
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-7 h-7 rounded flex items-center justify-center"
              style={{
                background: active ? '#1A6B4A' : '#F0EDE7',
                border: isToday ? '2px solid #1A6B4A' : '1px solid #E8E4DC',
              }}
            >
              {active && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                >
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span
              className="text-[9px]"
              style={{ color: isToday ? '#1A6B4A' : '#A8A29E' }}
            >
              {day.day.slice(0, 1)}
            </span>
          </div>
        )
      })}

      {streak > 0 && (
        <span className="ml-2 text-sm font-semibold" style={{ color: '#1A6B4A' }}>
          {streak} day streak
        </span>
      )}
    </div>
  )
}
