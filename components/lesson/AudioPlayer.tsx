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
    currentWordIndex,
    speed,
    isSupported,
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

  if (!isSupported) {
    return (
      <div className="text-center py-8">
        <SlideView slide={slide} mode="read" currentWordIndex={-1} isFirst={isFirst} isLast={isLast} topicIcon={topicIcon} lessonTitle={lessonTitle} slideIndex={slideIndex} totalSlides={totalSlides} onBack={onBack} />
        <p className="mt-4 text-sm text-gray-500">
          Audio playback is not supported in your browser. You can read the content above.
        </p>
      </div>
    )
  }

  const handlePlayPause = () => {
    if (!isPlaying) {
      play()
    } else if (isPaused) {
      resume()
    } else {
      pause()
    }
  }

  return (
    <div className="space-y-6">
      <SlideView slide={slide} mode="audio" currentWordIndex={currentWordIndex} isFirst={isFirst} isLast={isLast} topicIcon={topicIcon} lessonTitle={lessonTitle} slideIndex={slideIndex} totalSlides={totalSlides} onBack={onBack} />

      <div className="flex flex-col items-center gap-4">
        {/* Play/Pause button */}
        <Button
          onClick={handlePlayPause}
          className="w-14 h-14 rounded-full text-xl"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
            borderRadius: 'var(--button-radius)',
          }}
        >
          {!isPlaying || isPaused ? (
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
