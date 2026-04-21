import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/BackButton'

const GAMES = [
  {
    slug: 'word-hunter',
    name: 'Clean Write',
    description: 'Pick the cleaner, more direct sentence and sharpen your writing.',
    icon: '✏️',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    slug: 'communication-sense',
    name: 'Communication Sense',
    description: 'Choose the more effective communication style in real-world scenarios.',
    icon: '💬',
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    slug: 'word-search',
    name: 'Word Search',
    description: 'Identify key concept words hidden within messages and passages.',
    icon: '🔍',
    gradient: 'from-emerald-500 to-teal-600',
  },
]

export default function WordGamesPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <BackButton href="/home" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Word Games</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sharpen your communication skills through fun, bite-sized games.
        </p>
      </div>

      <div className="grid gap-4">
        {GAMES.map((game) => (
          <Card
            key={game.slug}
            className="p-5 flex items-center gap-4"
            style={{ borderRadius: 'var(--card-radius)' }}
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center text-2xl flex-shrink-0`}
            >
              {game.icon}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900">{game.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{game.description}</p>
            </div>

            <Link href={`/word-games/${game.slug}`}>
              <Button
                size="sm"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground)',
                  borderRadius: 'var(--button-radius)',
                }}
              >
                Play
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
