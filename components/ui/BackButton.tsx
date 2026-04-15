'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  href?: string  // fallback only — used when there's no browser history
  label?: string
}

export function BackButton({ href, label }: BackButtonProps) {
  const router = useRouter()

  function handleBack() {
    if (window.history.length > 1) {
      router.back()
    } else if (href) {
      router.push(href)
    } else {
      router.push('/home')
    }
  }

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
    >
      <ArrowLeft className="h-4 w-4" />
      {label && <span>{label}</span>}
    </button>
  )
}
