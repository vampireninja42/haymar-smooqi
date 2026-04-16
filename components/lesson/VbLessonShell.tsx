'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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

type VbLessonShellProps = {
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

export function VbLessonShell({ lesson }: VbLessonShellProps) {
  const router = useRouter()
  const [state, setState] = useState<LessonState>({
    phase: 'slides',
    currentSlide: 0,
    mode: 'read',
  })
  const touchStartRef = useRef<number>(0)
  const completeFiredRef = useRef(false)
  const quizFiredRef = useRef(false)

  const slides = lesson.slides.sort((a, b) => a.slideOrder - b.slideOrder)
  const totalSlides = slides.length
  const courseSlug = lesson.course.slug

  // ─── Hide AppHeader while vB reader is mounted ───────────────────

  useEffect(() => {
    document.body.classList.add('vb-reader-active')
    return () => {
      document.body.classList.remove('vb-reader-active')
    }
  }, [])

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
        const newSlide = prev.currentSlide + 1
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
        return { ...prev, currentSlide: prev.currentSlide - 1 }
      }
      return prev
    })
  }, [])

  const setMode = useCallback((mode: 'read' | 'audio') => {
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
      router.replace(`/learn/${courseSlug}/${nextLesson.slug}`)
    }
  }, [nextLesson, courseSlug, router])

  const handleBackToCourse = useCallback(() => {
    router.push(`/learn/${courseSlug}`)
  }, [courseSlug, router])

  // ─── Keyboard navigation ─────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (state.phase !== 'slides') return
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state, nextSlide, prevSlide])

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

  // ─── Derived values ──────────────────────────────────────────────

  const slidesProgress =
    state.phase === 'slides'
      ? ((state.currentSlide + 1) / totalSlides) * 100
      : state.phase === 'complete'
        ? 100
        : 100

  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  }

  // ─── Render ──────────────────────────────────────────────────────

  return (
    <div
      className="vb-fullscreen-reader min-h-[100dvh] relative"
      style={{ background: '#FAFAF6' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Thin top progress line — always visible */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[2px]"
        style={{ background: '#E8E4DC' }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${slidesProgress}%`, background: '#1A6B4A' }}
        />
      </div>

      {/* Top chrome — Back button always visible in all phases; slide
          counter only during slides phase. */}
      <div className="fixed top-2 left-0 right-0 z-40 flex items-center justify-between px-6">
        <button
          onClick={handleBackToCourse}
          className="flex items-center gap-1.5 text-sm"
          style={{ color: '#57534E' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>

        {state.phase === 'slides' && (
          <span className="text-xs font-medium" style={{ color: '#57534E' }}>
            {state.currentSlide + 1} / {totalSlides}
          </span>
        )}
      </div>

      {/* Main content — bottom padding clears bottom nav + iOS safe area */}
      <main
        className="pt-16 px-4"
        style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* ── Slides phase ── */}
        {state.phase === 'slides' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
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

      {/* Bottom nav — only during slides phase */}
      {state.phase === 'slides' && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 border-t"
          style={{
            background: '#FFFFFF',
            borderColor: '#E8E4DC',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <div className="max-w-[640px] mx-auto flex items-center justify-between px-6 py-4">
            {/* Previous */}
            <button
              onClick={prevSlide}
              disabled={state.currentSlide === 0}
              className="vb-btn-press flex items-center gap-1.5 text-sm transition-colors disabled:opacity-30"
              style={{ color: '#57534E' }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Prev
            </button>

            {/* Read / Listen toggle */}
            <div
              className="flex rounded-lg overflow-hidden border"
              style={{ borderColor: '#E8E4DC' }}
            >
              <button
                onClick={() => setMode('read')}
                className="vb-btn-press px-3 py-1.5 text-xs font-medium transition-colors"
                style={
                  state.mode === 'read'
                    ? { background: '#1A6B4A', color: '#FFFFFF' }
                    : { background: '#FFFFFF', color: '#57534E' }
                }
              >
                Read
              </button>
              <button
                onClick={() => setMode('audio')}
                className="vb-btn-press px-3 py-1.5 text-xs font-medium transition-colors"
                style={
                  state.mode === 'audio'
                    ? { background: '#1A6B4A', color: '#FFFFFF' }
                    : { background: '#FFFFFF', color: '#57534E' }
                }
              >
                Listen
              </button>
            </div>

            {/* Next / Done */}
            <button
              onClick={nextSlide}
              className="vb-btn-press flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: '#1A6B4A' }}
            >
              {state.currentSlide === totalSlides - 1 ? 'Done' : 'Next'}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
