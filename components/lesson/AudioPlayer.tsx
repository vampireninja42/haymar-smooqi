'use client'

import { useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { useSpeechPlayer } from '@/hooks/useSpeechPlayer'
import { SlideView } from './SlideView'

type AudioPlayerProps = {
  text: string
  slide: {
    title?: string | null
    content: string
    imageUrl?: string | null
    imageAlt?: string | null
  }
  onSlideComplete: () => void
  isFirst?: boolean
  isLast?: boolean
  topicIcon?: string
  lessonTitle?: string
  slideIndex?: number
  totalSlides?: number
  onBack?: () => void
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5] as const

export function AudioPlayer({ text, slide, onSlideComplete, isFirst, isLast, topicIcon, lessonTitle, slideIndex, totalSlides, onBack }: AudioPlayerProps) {
  const autoAdvanceRef = useRef(false)

  const handleComplete = useCallback(() => {
    if (autoAdvanceRef.current) return
    autoAdvanceRef.current = true
    setTimeout(() => {
      onSlideComplete()
      autoAdvanceRef.current = false
    }, 800)
  }, [onSlideComplete])

  const {
    isPlaying,
    isPaused,
    isLoading,
    currentWordIndex,
    speed,
    error,
    play,
    pause,
    resume,
    cancel,
    changeSpeed,
  } = useSpeechPlayer(text, handleComplete)

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      cancel()
    }
  }, [cancel])

  const handlePlayPause = () => {
    if (isLoading) return
    if (!isPlaying) {
      void play()
    } else if (isPaused) {
      resume()
    } else {
      pause()
    }
  }

  return (
    <div className="space-y-6">
      <SlideView slide={slide} mode="audio" currentWordIndex={currentWordIndex} isFirst={isFirst} isLast={isLast} topicIcon={topicIcon} lessonTitle={lessonTitle} slideIndex={slideIndex} totalSlides={totalSlides} onBack={onBack} />

      {error === 'unavailable' && (
        <div className="mx-auto max-w-md rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          🎧 Audio mode is temporarily unavailable. Reading mode works normally.
        </div>
      )}
      {error === 'network' && (
        <div className="mx-auto max-w-md rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          🎧 Couldn’t load audio right now. Try again in a moment.
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        {/* Play/Pause button */}
        <Button
          onClick={handlePlayPause}
          disabled={isLoading}
          className="w-14 h-14 rounded-full text-xl"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
            borderRadius: 'var(--button-radius)',
          }}
        >
          {isLoading ? (
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
              <path d="M21 12a9 9 0 0 0-9-9" />
            </svg>
          ) : !isPlaying || isPaused ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          )}
        </Button>

        {/* Speed selector */}
        <div className="flex gap-1 bg-gray-100 rounded-full p-1">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => changeSpeed(s)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                speed === s
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
