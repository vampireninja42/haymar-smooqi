'use client'

import { useState, useCallback, useRef, useMemo, useEffect } from 'react'

export type SpeechPlayerError = 'unavailable' | null

export function useSpeechPlayer(text: string, onComplete: () => void) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [speed, setSpeed] = useState(1)
  const [isSupported, setIsSupported] = useState(true)
  const [error] = useState<SpeechPlayerError>(null)

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])

  const wordPositions = useMemo(() => {
    const positions: number[] = []
    let offset = 0
    for (const word of words) {
      const idx = text.indexOf(word, offset)
      positions.push(idx)
      offset = idx + word.length
    }
    return positions
  }, [text, words])

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setIsSupported(false)
    }
  }, [])

  const play = useCallback(async () => {
    if (!isSupported || !text.trim()) return

    setIsLoading(true)
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = speed

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex
        let foundIndex = 0
        for (let i = 0; i < wordPositions.length; i++) {
          if (wordPositions[i] <= charIndex) {
            foundIndex = i
          } else {
            break
          }
        }
        setCurrentWordIndex(foundIndex)
      }
    }

    utterance.onstart = () => {
      setIsLoading(false)
      setIsPlaying(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentWordIndex(-1)
      utteranceRef.current = null
      onComplete()
    }

    utterance.onerror = () => {
      setIsLoading(false)
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentWordIndex(-1)
    }

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
  }, [text, speed, wordPositions, onComplete, isSupported])

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [])

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.resume()
      setIsPaused(false)
    }
  }, [])

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    setIsPlaying(false)
    setIsPaused(false)
    setIsLoading(false)
    setCurrentWordIndex(-1)
    utteranceRef.current = null
  }, [])

  const changeSpeed = useCallback(
    (newSpeed: number) => {
      setSpeed(newSpeed)
      if (isPlaying) {
        cancel()
      }
    },
    [isPlaying, cancel]
  )

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        speechSynthesis.cancel()
      }
    }
  }, [])

  return {
    isPlaying,
    isPaused,
    isLoading,
    currentWordIndex,
    speed,
    words,
    isSupported,
    error,
    play,
    pause,
    resume,
    cancel,
    changeSpeed,
  }
}
