import { cn } from '@/lib/utils'

const levelStyles: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-purple-100 text-purple-700',
}

interface LevelBadgeProps {
  level: string
}

export function LevelBadge({ level }: LevelBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
        levelStyles[level] ?? 'bg-gray-100 text-gray-700'
      )}
    >
      {level}
    </span>
  )
}
