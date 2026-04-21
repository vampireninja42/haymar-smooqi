'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { themeConfig } from '@/lib/theme'
import { HighlightedText } from './HighlightedText'
import { LessonHeader } from './LessonHeader'

type SlideViewProps = {
  slide: {
    title?: string | null
    content: string
    imageUrl?: string | null
    imageAlt?: string | null
  }
  mode: 'read' | 'audio'
  currentWordIndex: number
  isFirst?: boolean
  isLast?: boolean
  topicIcon?: string
  lessonTitle?: string
  slideIndex?: number
  totalSlides?: number
  onBack?: () => void
}

function formatSlideContent(content: string) {
  const lines = content.split('\n').filter((line) => line.trim() !== '')
  const elements: React.ReactNode[] = []
  let bulletBuffer: string[] = []
  let orderedBuffer: { num: string; text: string }[] = []

  const isVB = themeConfig.isVB
  const bodyFontSize = isVB ? '16px' : '15px'
  const bodyLineHeight = isVB ? 1.85 : 1.7
  const bodyColor = isVB ? '#57534E' : undefined

  function flushBullets() {
    if (bulletBuffer.length === 0) return
    elements.push(
      <ul key={`ul-${elements.length}`} className="my-3 space-y-1.5 pl-5">
        {bulletBuffer.map((item, i) => (
          <li
            key={i}
            className={cn('list-disc', !isVB && 'text-gray-700')}
            style={{ fontSize: bodyFontSize, lineHeight: bodyLineHeight, color: bodyColor }}
          >
            {formatInline(item)}
          </li>
        ))}
      </ul>
    )
    bulletBuffer = []
  }

  function flushOrdered() {
    if (orderedBuffer.length === 0) return
    elements.push(
      <ol key={`ol-${elements.length}`} className="my-3 space-y-1.5 pl-5">
        {orderedBuffer.map((item, i) => (
          <li
            key={i}
            className={cn('list-decimal', !isVB && 'text-gray-700')}
            style={{ fontSize: bodyFontSize, lineHeight: bodyLineHeight, color: bodyColor }}
          >
            {formatInline(item.text)}
          </li>
        ))}
      </ol>
    )
    orderedBuffer = []
  }

  function formatInline(text: string): React.ReactNode {
    // Handle **bold** markdown
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    if (parts.length === 1) return text
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  for (const line of lines) {
    const trimmed = line.trim()

    // Bullet list items
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      flushOrdered()
      const text = trimmed.startsWith('- ') ? trimmed.slice(2) : trimmed.slice(2)
      bulletBuffer.push(text)
      continue
    }

    // Numbered list items
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/)
    if (numberedMatch) {
      flushBullets()
      orderedBuffer.push({ num: numberedMatch[1], text: numberedMatch[2] })
      continue
    }

    // Regular text line - flush any pending lists
    flushBullets()
    flushOrdered()

    // Split by sentences for lead text treatment
    // Only do sentence splitting for the first text block
    if (elements.length === 0) {
      const sentences = trimmed.split(/(?<=\.)\s+/)
      if (sentences.length > 1) {
        elements.push(
          <p
            key={`lead-${elements.length}`}
            className={cn('mb-2', !isVB && 'text-lg font-medium text-gray-900')}
            style={
              isVB
                ? { fontSize: '18px', fontWeight: 500, color: '#1C1917', lineHeight: 1.85 }
                : { lineHeight: 1.6 }
            }
          >
            {formatInline(sentences[0])}
          </p>
        )
        elements.push(
          <p
            key={`body-${elements.length}`}
            className={cn('mb-2', !isVB && 'text-gray-700')}
            style={{ fontSize: bodyFontSize, lineHeight: bodyLineHeight, color: bodyColor }}
          >
            {formatInline(sentences.slice(1).join(' '))}
          </p>
        )
      } else {
        elements.push(
          <p
            key={`lead-${elements.length}`}
            className={cn('mb-2', !isVB && 'text-lg font-medium text-gray-900')}
            style={
              isVB
                ? { fontSize: '18px', fontWeight: 500, color: '#1C1917', lineHeight: 1.85 }
                : { lineHeight: 1.6 }
            }
          >
            {formatInline(trimmed)}
          </p>
        )
      }
    } else {
      elements.push(
        <p
          key={`p-${elements.length}`}
          className={cn('mb-2', !isVB && 'text-gray-700')}
          style={{ fontSize: bodyFontSize, lineHeight: bodyLineHeight, color: bodyColor }}
        >
          {formatInline(trimmed)}
        </p>
      )
    }
  }

  // Flush remaining
  flushBullets()
  flushOrdered()

  return elements
}

export function SlideView({ slide, mode, currentWordIndex, isFirst, isLast, topicIcon, lessonTitle, slideIndex: _slideIndex, totalSlides: _totalSlides, onBack }: SlideViewProps) {
  const icon = topicIcon || '💡'
  const isVB = themeConfig.isVB

  // ── vB: full-screen reader — no card wrapper, no LessonHeader (VbLessonShell handles its own chrome)
  if (isVB) {
    return (
      <div className="max-w-[640px] mx-auto px-4 py-8">
        {isFirst && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            {lessonTitle && (
              <span className="text-sm font-medium" style={{ color: '#A8A29E' }}>
                {lessonTitle}
              </span>
            )}
          </div>
        )}

        {isLast && (
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: '#A8A29E' }}
          >
            Key Takeaway
          </p>
        )}

        {slide.imageUrl && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
            <Image
              src={slide.imageUrl}
              alt={slide.imageAlt || ''}
              fill
              className="object-cover"
            />
          </div>
        )}

        {slide.title && (
          <h2
            className="text-2xl font-bold mb-5"
            style={{
              color: '#1A6B4A',
              fontFamily: 'var(--font-playfair)',
              lineHeight: 1.3,
            }}
          >
            {slide.title}
          </h2>
        )}

        {mode === 'audio' ? (
          <HighlightedText text={slide.content} currentWordIndex={currentWordIndex} />
        ) : (
          <div>{formatSlideContent(slide.content)}</div>
        )}
      </div>
    )
  }

  // ── vA: existing card-based layout, unchanged
  return (
    <Card
      className={cn(
        'max-w-[680px] mx-auto bg-white',
        'p-8',
        themeConfig.isVA
          ? 'rounded-[16px] shadow-lg border-0'
          : 'rounded-[12px] border'
      )}
    >
      {lessonTitle && onBack && (
        <LessonHeader
          lessonTitle={lessonTitle}
          slideIndex={_slideIndex ?? 0}
          totalSlides={_totalSlides ?? 1}
          onBack={onBack}
        />
      )}

      {/* First slide: topic emoji */}
      {isFirst && (
        <div className="mb-4 text-center">
          <span className="text-4xl">{icon}</span>
        </div>
      )}

      {/* Last slide: Key Takeaway label */}
      {isLast && (
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--color-primary)' }}
        >
          Key Takeaway
        </p>
      )}

      {slide.imageUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
          <Image
            src={slide.imageUrl}
            alt={slide.imageAlt || ''}
            fill
            className="object-cover"
          />
        </div>
      )}

      {slide.title && (
        <p
          className={cn(
            'uppercase font-semibold tracking-wide mb-2',
            isFirst ? 'text-base text-center' : 'text-sm'
          )}
          style={{ color: 'var(--color-primary)' }}
        >
          {slide.title}
        </p>
      )}

      {mode === 'audio' ? (
        <HighlightedText text={slide.content} currentWordIndex={currentWordIndex} />
      ) : (
        <div className={cn(isLast && 'text-lg', isFirst && 'text-center')}>
          {formatSlideContent(slide.content)}
        </div>
      )}
    </Card>
  )
}
