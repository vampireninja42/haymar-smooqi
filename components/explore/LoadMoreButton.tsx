'use client'

import { useRouter } from 'next/navigation'

interface Props {
  href: string
  variant: 'vA' | 'vB'
}

export function LoadMoreButton({ href, variant }: Props) {
  const router = useRouter()
  const handleClick = () => {
    router.push(href, { scroll: false })
  }

  if (variant === 'vB') {
    return (
      <button
        onClick={handleClick}
        className="inline-block px-6 py-2.5 text-sm font-medium border transition-colors"
        style={{
          borderColor: '#1A6B4A',
          color: '#1A6B4A',
          borderRadius: '8px',
          background: '#FFFFFF',
        }}
      >
        Load more
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="inline-block rounded-[var(--button-radius)] border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
    >
      Load More
    </button>
  )
}
