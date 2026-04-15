'use client'

type GameHeaderProps = {
  currentRound: number
  totalRounds: number
  score: number
}

export function GameHeader({ currentRound, totalRounds, score }: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-gray-500">
        Round {currentRound} / {totalRounds}
      </span>
      <span className="text-sm font-semibold text-gray-900">
        Score: {score}
      </span>
    </div>
  )
}
