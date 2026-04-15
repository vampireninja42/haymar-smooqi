const topicGradients: Record<string, { from: string; to: string; emoji: string }> = {
  'Learning Science': { from: '#667eea', to: '#764ba2', emoji: '\uD83E\uDDE0' },
  'Habits': { from: '#f093fb', to: '#f5576c', emoji: '\uD83D\uDD25' },
  'Communication': { from: '#4facfe', to: '#00f2fe', emoji: '\uD83D\uDCAC' },
  'Psychology': { from: '#43e97b', to: '#38f9d7', emoji: '\uD83E\uDDEC' },
  'Finance': { from: '#fa709a', to: '#fee140', emoji: '\uD83D\uDCB0' },
  'default': { from: '#a18cd1', to: '#fbc2eb', emoji: '\uD83D\uDCDA' },
}

export function TopicIllustration({ topic, className }: { topic: string; className?: string }) {
  const config = topicGradients[topic] ?? topicGradients.default
  return (
    <div
      className={`flex items-center justify-center rounded-xl ${className ?? ''}`}
      style={{ background: `linear-gradient(135deg, ${config.from}, ${config.to})` }}
    >
      <span className="text-5xl">{config.emoji}</span>
    </div>
  )
}
