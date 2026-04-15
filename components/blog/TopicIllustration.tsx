import Image from 'next/image'

const topicImages: Record<string, string> = {
  'Learning Science': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  'Habits': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
  'Communication': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  'Psychology': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80',
  'Finance': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  'Intelligence': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'Philosophy': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  'Biology': 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
}

export function TopicIllustration({ topic, className }: { topic: string; className?: string }) {
  const src = topicImages[topic] ?? topicImages['default']
  return (
    <div className={`relative overflow-hidden rounded-xl ${className ?? ''}`}>
      <Image
        src={src}
        alt={topic}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 400px"
      />
      {/* subtle dark overlay for text legibility if needed */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  )
}
