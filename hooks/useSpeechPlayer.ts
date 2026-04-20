'use client'

import { useState, useCallback, useRef, useMemo, useEffect } from 'react'

export type SpeechPlayerError = 'unavailable' | 'network' | null

export function useSpeechPlayer(text: string, onComplete: () => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const highlightTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [speed, setSpeed] = useState(1)
  const [error, setError] = useState<SpeechPlayerError>(null)

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])

  const clearHighlightTimer = useCallback(() => {
    if (highlightTimerRef.current) {
      clearInterval(highlightTimerRef.current)
      highlightTimerRef.current = null
    }
  }, [])

  const cleanupAudio = useCallback(() => {
    clearHighlightTimer()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
  }, [clearHighlightTimer])

  const startWordHighlighting = useCallback(
    (durationSec: number) => {
      clearHighlightTimer()
      if (!words.length || !Number.isFinite(durationSec) || durationSec <= 0) {
        return
      }
      const perWordMs = (durationSec * 1000) / words.length
      // Tick a little faster than one-word intervals so the highlight reads smoothly.
      const tickMs = Math.max(40, Math.min(perWordMs / 2, 200))
      highlightTimerRef.current = setInterval(() => {
        const audio = audioRef.current
        if (!audio) return
        const elapsedMs = audio.currentTime * 1000
        const index = Math.min(words.length - 1, Math.floor(elapsedMs / perWordMs))
        setCurrentWordIndex(index)
      }, tickMs)
    },
    [clearHighlightTimer, words.length]
  )

  const play = useCallback(async () => {
    if (!text.trim()) return

    // Tear down any previous playback before starting fresh.
    cleanupAudio()
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    setError(null)
    setIsLoading(true)
    setCurrentWordIndex(-1)

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      })

      if (!response.ok) {
        if (response.status === 503) {
          setError('unavailable')
        } else {
          setError('network')
        }
        setIsLoading(false)
        return
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      audioUrlRef.current = url

      const audio = new Audio(url)
      audio.playbackRate = speed
      audioRef.current = audio

      audio.onloadedmetadata = () => {
        startWordHighlighting(audio.duration)
      }

      audio.onended = () => {
        clearHighlightTimer()
        setIsPlaying(false)
        setIsPaused(false)
        setCurrentWordIndex(-1)
        cleanupAudio()
        onComplete()
      }

      audio.onerror = () => {
        clearHighlightTimer()
        setError('network')
        setIsPlaying(false)
        setIsPaused(false)
        cleanupAudio()
      }

      await audio.play()
      setIsPlaying(true)
      setIsPaused(false)
    } catch (err) {
      if ((err as { name?: string })?.name === 'AbortError') return
      console.error('TTS playback failed:', err)
      setError('network')
      cleanupAudio()
    } finally {
      setIsLoading(false)
    }
  }, [text, speed, cleanupAudio, clearHighlightTimer, startWordHighlighting, onComplete])

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setIsPaused(true)
    }
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      void audioRef.current.play()
      setIsPaused(false)
    }
  }, [])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    cleanupAudio()
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentWordIndex(-1)
  }, [cleanupAudio])

  const changeSpeed = useCallback(
    (newSpeed: number) => {
      setSpeed(newSpeed)
      if (audioRef.current) {
        audioRef.current.playbackRate = newSpeed
        // Re-base the highlight cadence to the new effective duration.
        const remaining = audioRef.current.duration - audioRef.current.currentTime
        if (Number.isFinite(remaining) && remaining > 0) {
          startWordHighlighting(audioRef.current.duration / newSpeed)
        }
      }
    },
    [startWordHighlighting]
  )

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort()
      cleanupAudio()
    }
  }, [cleanupAudio])

  return {
    isPlaying,
    isPaused,
    isLoading,
    currentWordIndex,
    speed,
    words,
    // Voicebox runs server-side; the browser itself always "supports" audio playback.
    isSupported: true,
    error,
    play,
    pause,
    resume,
    cancel,
    changeSpeed,
  }
}
