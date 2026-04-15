'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { themeConfig } from '@/lib/theme'
import { HighlightedText } from './HighlightedText'

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
}

function formatSlideContent(content: string) {
  const lines = content.split('\n').filter((line) => line.trim() !== '')
  const elements: React.ReactNode[] = []
  let bulletBuffer: string[] = []
  let orderedBuffer: { num: string; text: string }[] = []

  function flushBullets() {
    if (bulletBuffer.length === 0) return
    elements.push(
      <ul key={`ul-${elements.length}`} className="my-3 space-y-1.5 pl-5">
        {bulletBuffer.map((item, i) => (
          <li key={i} className="list-disc text-gray-700" style={{ fontSize: '15px', lineHeight: 1.7 }}>
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
          <li key={i} className="list-decimal text-gray-700" style={{ fontSize: '15px', lineHeight: 1.7 }}>
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
    if (trimmed.startsWith('- ') || trimmed.startsWith('\u2022 ')) {
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
      // Split on ". " keeping the period
      const sentences = trimmed.split(/(?<=\.)\s+/)
      if (sentences.length > 1) {
        elements.push(
          <p key={`lead-${elements.length}`} className="text-lg font-medium text-gray-900 mb-2" style={{ lineHeight: 1.6 }}>
            {formatInline(sentences[0])}
          </p>
        )
        elements.push(
          <p key={`body-${elements.length}`} className="text-gray-700 mb-2" style={{ fontSize: '15px', lineHeight: 1.7 }}>
            {formatInline(sentences.slice(1).join(' '))}
          </p>
        )
      } else {
        elements.push(
          <p key={`lead-${elements.length}`} className="text-lg font-medium text-gray-900 mb-2" style={{ lineHeight: 1.6 }}>
            {formatInline(trimmed)}
          </p>
        )
      }
    } else {
      elements.push(
        <p key={`p-${elements.length}`} className="text-gray-700 mb-2" style={{ fontSize: '15px', lineHeight: 1.7 }}>
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

export function SlideView({ slide, mode, currentWordIndex, isFirst, isLast, topicIcon }: SlideViewProps) {
  const icon = topicIcon || '\uD83D\uDCA1'

  return (
    <Card
      className={cn(
        'max-w-[680px] mx-auto p-8 bg-white',
        themeConfig.isVA
          ? 'rounded-[16px] shadow-lg border-0'
          : 'rounded-[12px] border'
      )}
    >
      {/* First slide: large topic emoji at top */}
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
            isFirst ? 'text-base' : 'text-sm'
          )}
          style={{ color: 'var(--color-primary)' }}
        >
          {slide.title}
        </p>
      )}

      {mode === 'audio' ? (
        <HighlightedText text={slide.content} currentWordIndex={currentWordIndex} />
      ) : (
        <div className={cn(isLast && 'text-lg')}>
          {formatSlideContent(slide.content)}
        </div>
      )}
    </Card>
  )
}
