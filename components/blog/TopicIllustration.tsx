import Image from 'next/image'

const topicMap: Record<string, { file: string; bg: string }> = {
  'Learning Science': { file: '/illustrations/learning.svg', bg: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)' },
  'Habits':           { file: '/illustrations/habits.svg',   bg: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)' },
  'Communication':    { file: '/illustrations/communication.svg', bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' },
  'Psychology':       { file: '/illustrations/psychology.svg', bg: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)' },
  'Finance':          { file: '/illustrations/finance.svg',  bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' },
  'Philosophy':       { file: '/illustrations/philosophy.svg', bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)' },
  'Biology':          { file: '/illustrations/biology.svg',  bg: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)' },
}

const DEFAULT = { file: '/illustrations/default.svg', bg: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)' }

export function TopicIllustration({ topic, className }: { topic: string; className?: string }) {
  const config = topicMap[topic] ?? DEFAULT

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-xl ${className ?? ''}`}
      style={{ background: config.bg }}
    >
      <div className="relative h-full w-full p-6">
        <Image
          src={config.file}
          alt={topic}
          fill
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
    </div>
  )
}
