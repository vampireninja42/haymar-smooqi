'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SlideView } from './SlideView'
import { AudioPlayer } from './AudioPlayer'
import { LessonComplete } from './LessonComplete'
import { QuizQuestion } from './QuizQuestion'
import { QuizSummary } from './QuizSummary'

// ─── Types ───────────────────────────────────────────────────────────

type Slide = {
  id: string
  slideOrder: number
  slideType: string
  title?: string | null
  content: string
  imageUrl?: string | null
  imageAlt?: string | null
}

type QuizQ = {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanation?: string | null
}

type LessonPlayerProps = {
  lesson: {
    id: string
    title: string
    slug: string
    slides: Slide[]
    quizQuestions: QuizQ[]
    course: {
      id: string
      slug: string
      title: string
      topic: { slug: string; name: string; icon: string }
      lessons: Array<{ id: string; slug: string; sortOrder: number }>
    }
  }
  initialProgress: {
    lessonCompleted: boolean
    quizPassed: boolean
    quizScore: number | null
  } | null
  userId: string
}

type LessonState =
  | { phase: 'slides'; currentSlide: number; mode: 'read' | 'audio' }
  | { phase: 'complete' }
  | { phase: 'quiz'; currentQuestion: number; answers: Record<number, string>; correctCount: number }
  | { phase: 'quiz-summary'; score: number }

// ─── Component ───────────────────────────────────────────────────────

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const router = useRouter()
  const [state, setState] = useState<LessonState>({
    phase: 'slides',
    currentSlide: 0,
    mode: 'read',
  })
  const [direction, setDirection] = useState(1)
  const touchStartRef = useRef<number>(0)
  const completeFiredRef = useRef(false)
  const quizFiredRef = useRef(false)

  const slides = lesson.slides.sort((a, b) => a.slideOrder - b.slideOrder)
  const totalSlides = slides.length
  const courseSlug = lesson.course.slug
  void lesson.course.topic.slug // available for future use

  // ─── API calls on phase transitions ──────────────────────────────

  useEffect(() => {
    if (state.phase === 'complete' && !completeFiredRef.current) {
      completeFiredRef.current = true

      Promise.all([
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'lesson_complete',
            lessonId: lesson.id,
            courseId: lesson.course.id,
          }),
        }).then(r => r.json()),
        fetch('/api/xp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 10,
            source: 'lesson_complete',
          }),
        }).then(r => r.json()),
        fetch('/api/streak', {
          method: 'POST',
        }).then(r => r.json()),
      ])
      .then(([progressRes, xpRes, streakRes]) => {
        const allNew = [
          ...(progressRes?.newAchievements ?? []),
          ...(xpRes?.newAchievements ?? []),
          ...(streakRes?.newAchievements ?? []),
        ]
        const seen = new Set<string>()
        const unique = allNew.filter((a: { id: string }) => {
          if (seen.has(a.id)) return false
          seen.add(a.id)
          return true
        })
        unique.forEach((achievement: { id: string }, i: number) => {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('achievement-unlock', { detail: achievement }))
          }, i * 1200)
        })
      })
      .catch(console.error)
    }
  }, [state.phase, lesson.id, lesson.course.id])

  useEffect(() => {
    if (state.phase === 'quiz-summary' && !quizFiredRef.current) {
      const { score } = state
      if (score >= 2) {
        quizFiredRef.current = true

        Promise.all([
          fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'quiz_result',
              lessonId: lesson.id,
              courseId: lesson.course.id,
              quizScore: score,
              quizPassed: score >= 2,
            }),
          }).then(r => r.json()),
          fetch('/api/xp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: score >= 2 ? 15 : 5,
              source: 'quiz_pass',
            }),
          }).then(r => r.json()),
        ])
        .then(([progressRes, xpRes]) => {
          const allNew = [
            ...(progressRes?.newAchievements ?? []),
            ...(xpRes?.newAchievements ?? []),
          ]
          const seen = new Set<string>()
          const unique = allNew.filter((a: { id: string }) => {
            if (seen.has(a.id)) return false
            seen.add(a.id)
            return true
          })
          unique.forEach((achievement: { id: string }, i: number) => {
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('achievement-unlock', { detail: achievement }))
            }, i * 1200)
          })
        })
        .catch(console.error)
      }
    }
  }, [state, lesson.id, lesson.course.id])

  // ─── Navigation helpers ──────────────────────────────────────────



  const nextSlide = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'slides') return prev
      if (prev.currentSlide < totalSlides - 1) {
        setDirection(1)
        const newSlide = prev.currentSlide + 1
        // Track slide progress (fire and forget)
        if (newSlide > 0) {
          fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              courseId: lesson.course.id,
              lessonId: lesson.id,
              type: 'slide_progress',
              slidesCompleted: newSlide,
            }),
          }).catch(() => {})
        }
        return { ...prev, currentSlide: newSlide }
      }
      // Last slide -> complete
      return { phase: 'complete' }
    })
  }, [totalSlides, lesson.course.id, lesson.id])

  const prevSlide = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'slides') return prev
      if (prev.currentSlide > 0) {
        setDirection(-1)
        return { ...prev, currentSlide: prev.currentSlide - 1 }
      }
      return prev
    })
  }, [])

  const toggleMode = useCallback((mode: 'read' | 'audio') => {
    setState((prev) => {
      if (prev.phase !== 'slides') return prev
      return { ...prev, mode }
    })
  }, [])

  const handleTakeQuiz = useCallback(() => {
    setState({ phase: 'quiz', currentQuestion: 0, answers: {}, correctCount: 0 })
  }, [])

  const handleQuizAnswer = useCallback((isCorrect: boolean) => {
    setState((prev) => {
      if (prev.phase !== 'quiz') return prev
      const newCorrectCount = prev.correctCount + (isCorrect ? 1 : 0)
      const nextQ = prev.currentQuestion + 1

      if (nextQ >= lesson.quizQuestions.length) {
        return { phase: 'quiz-summary', score: newCorrectCount }
      }

      return {
        ...prev,
        currentQuestion: nextQ,
        correctCount: newCorrectCount,
      }
    })
  }, [lesson.quizQuestions.length])

  const handleTryAgain = useCallback(() => {
    quizFiredRef.current = false
    setState({ phase: 'quiz', currentQuestion: 0, answers: {}, correctCount: 0 })
  }, [])

  // Find next lesson
  const sortedLessons = lesson.course.lessons.sort((a, b) => a.sortOrder - b.sortOrder)
  const currentLessonIndex = sortedLessons.findIndex((l) => l.id === lesson.id)
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < sortedLessons.length - 1
    ? sortedLessons[currentLessonIndex + 1]
    : null

  const handleNextLesson = useCallback(() => {
    if (nextLesson) {
      router.push(`/learn/${courseSlug}/${nextLesson.slug}`)
    }
  }, [nextLesson, courseSlug, router])

  const handleBackToCourse = useCallback(() => {
    router.push(`/learn/${courseSlug}`)
  }, [courseSlug, router])

  // ─── Touch swipe ─────────────────────────────────────────────────

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (state.phase !== 'slides') return
    const diff = touchStartRef.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide()
      else prevSlide()
    }
  }

  // ─── Slide animation variants ────────────────────────────────────

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  }

  // ─── Render ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col">
      {/* Content */}
      <main
        className="flex-1 px-4 py-6"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Slides phase ── */}
        {state.phase === 'slides' && (
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={state.currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {state.mode === 'audio' ? (
                  <AudioPlayer
                    text={slides[state.currentSlide].content}
                    slide={slides[state.currentSlide]}
                    onSlideComplete={nextSlide}
                    isFirst={state.currentSlide === 0}
                    isLast={state.currentSlide === slides.length - 1}
                    topicIcon={lesson.course.topic.icon}
                    lessonTitle={lesson.title}
                    slideIndex={state.currentSlide}
                    totalSlides={totalSlides}
                    onBack={handleBackToCourse}
                  />
                ) : (
                  <SlideView
                    slide={slides[state.currentSlide]}
                    mode="read"
                    currentWordIndex={-1}
                    isFirst={state.currentSlide === 0}
                    isLast={state.currentSlide === slides.length - 1}
                    topicIcon={lesson.course.topic.icon}
                    lessonTitle={lesson.title}
                    slideIndex={state.currentSlide}
                    totalSlides={totalSlides}
                    onBack={handleBackToCourse}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="max-w-[680px] mx-auto mt-6">
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  initial={false}
                  animate={{
                    width: `${((state.currentSlide + 1) / totalSlides) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Toggle + Navigation */}
            <div className="max-w-[680px] mx-auto mt-6">
              {/* Toggle — always visible, centered */}
              <div className="flex justify-center mb-4">
                <div className="flex bg-gray-100 rounded-full p-0.5">
                  <button
                    onClick={() => toggleMode('read')}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                      state.mode === 'read' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                    )}
                  >
                    Read
                  </button>
                  <button
                    onClick={() => toggleMode('audio')}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                      state.mode === 'audio' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                    )}
                  >
                    Audio
                  </button>
                </div>
              </div>

              {/* Previous / Next — only in read mode */}
              {state.mode === 'read' && (
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={prevSlide}
                    disabled={state.currentSlide === 0}
                    className="text-gray-500"
                  >
                    &larr; Previous
                  </Button>
                  <Button
                    onClick={nextSlide}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-primary-foreground)',
                      borderRadius: 'var(--button-radius)',
                    }}
                  >
                    {state.currentSlide === totalSlides - 1 ? 'Complete Lesson' : 'Next →'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Complete phase ── */}
        {state.phase === 'complete' && (
          <LessonComplete lessonTitle={lesson.title} onTakeQuiz={handleTakeQuiz} />
        )}

        {/* ── Quiz phase ── */}
        {state.phase === 'quiz' && (
          <QuizQuestion
            key={state.currentQuestion}
            question={lesson.quizQuestions[state.currentQuestion]}
            questionNumber={state.currentQuestion + 1}
            totalQuestions={lesson.quizQuestions.length}
            onAnswer={handleQuizAnswer}
          />
        )}

        {/* ── Quiz summary phase ── */}
        {state.phase === 'quiz-summary' && (
          <QuizSummary
            score={state.score}
            totalQuestions={lesson.quizQuestions.length}
            onNextLesson={handleNextLesson}
            onBackToCourse={handleBackToCourse}
            onTryAgain={handleTryAgain}
            hasNextLesson={!!nextLesson}
          />
        )}
      </main>
    </div>
  )
}
