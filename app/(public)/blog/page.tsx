import { BackButton } from '@/components/ui/BackButton'

export default function BlogPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <BackButton href="/" />
      <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
      <p className="mt-2 text-sm text-gray-500">Coming Soon</p>
    </div>
  )
}
