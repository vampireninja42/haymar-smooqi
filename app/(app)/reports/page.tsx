import { BackButton } from '@/components/ui/BackButton'

export default function ReportsPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <BackButton href="/home" />
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      <p className="mt-2 text-sm text-gray-500">Coming in Phase 2</p>
    </div>
  )
}
