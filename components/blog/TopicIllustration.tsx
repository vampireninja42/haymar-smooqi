const topicConfig: Record<string, {
  gradient: string
  emoji: string
  accent: string
}> = {
  'Learning Science': {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    emoji: '🧠',
    accent: 'rgba(255,255,255,0.12)',
  },
  'Habits': {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    emoji: '🔥',
    accent: 'rgba(255,255,255,0.12)',
  },
  'Communication': {
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    emoji: '💬',
    accent: 'rgba(255,255,255,0.12)',
  },
  'Psychology': {
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    emoji: '🧬',
    accent: 'rgba(255,255,255,0.12)',
  },
  'Finance': {
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    emoji: '💰',
    accent: 'rgba(255,255,255,0.12)',
  },
  'Intelligence': {
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    emoji: '💡',
    accent: 'rgba(255,255,255,0.12)',
  },
  'Philosophy': {
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    emoji: '🏛️',
    accent: 'rgba(0,0,0,0.06)',
  },
  'Biology': {
    gradient: 'linear-gradient(135deg, #a1ffce 0%, #faffd1 100%)',
    emoji: '🌿',
    accent: 'rgba(0,0,0,0.06)',
  },
  'default': {
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    emoji: '📚',
    accent: 'rgba(255,255,255,0.12)',
  },
}

export function TopicIllustration({ topic, className }: { topic: string; className?: string }) {
  const config = topicConfig[topic] ?? topicConfig['default']

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className ?? ''}`}
      style={{ background: config.gradient }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-6 -right-6 h-24 w-24 rounded-full"
        style={{ background: config.accent }}
      />
      <div
        className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full"
        style={{ background: config.accent }}
      />
      {/* Main emoji */}
      <span className="relative z-10 text-6xl drop-shadow-sm select-none">{config.emoji}</span>
    </div>
  )
}
