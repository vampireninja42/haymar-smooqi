import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { BackButton } from '@/components/ui/BackButton'
import { CommSense } from '@/components/word-games/CommSense'
import { WordSearch } from '@/components/word-games/WordSearch'

type Props = {
  params: Promise<{ gameSlug: string }>
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default async function GamePage({ params }: Props) {
  const { gameSlug } = await params

  const game = await prisma.wordGame.findUnique({
    where: { slug: gameSlug },
  })

  if (!game) {
    notFound()
  }

  const allRounds = await prisma.wordGameRound.findMany({
    where: { gameId: game.id },
  })

  const rounds = shuffle(allRounds).slice(0, 5)

  if (gameSlug === 'word-hunter') {
    const mapped = rounds.map((r) => {
      const c = r.content as {
        optionA: string
        optionB: string
        effectiveOption: 'A' | 'B'
        explanation: string
      }
      return {
        optionA: c.optionA,
        optionB: c.optionB,
        effectiveOption: c.effectiveOption,
        explanation: c.explanation,
      }
    })

    return (
      <div className="max-w-2xl mx-auto py-4">
        <BackButton href="/word-games" />
        <CommSense rounds={mapped} />
      </div>
    )
  }

  if (gameSlug === 'communication-sense') {
    const mapped = rounds.map((r) => {
      const c = r.content as {
        optionA: string
        optionB: string
        effectiveOption: 'A' | 'B'
        explanation: string
      }
      return {
        optionA: c.optionA,
        optionB: c.optionB,
        effectiveOption: c.effectiveOption,
        explanation: c.explanation,
      }
    })

    return (
      <div className="max-w-2xl mx-auto py-4">
        <BackButton href="/word-games" />
        <CommSense rounds={mapped} />
      </div>
    )
  }

  if (gameSlug === 'word-search') {
    const mapped = rounds.map((r) => {
      const c = r.content as {
        message: string
        conceptWords: string[]
        explanation: string
      }
      return {
        message: c.message,
        conceptWords: c.conceptWords,
        explanation: c.explanation,
      }
    })

    return (
      <div className="max-w-2xl mx-auto py-4">
        <BackButton href="/word-games" />
        <WordSearch rounds={mapped} />
      </div>
    )
  }

  notFound()
}
