'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Topic {
  slug: string
  name: string
  icon: string
}

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  topics: Topic[]
  totalCount: number
}

const LEVELS = [
  { value: '', label: 'All' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const ACCESS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'premium', label: 'Premium' },
]

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'level', label: 'By Level' },
]

export function FilterDrawer({ isOpen, onClose, topics, totalCount }: FilterDrawerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [topic, setTopic] = useState(searchParams.get('topic') ?? '')
  const [level, setLevel] = useState(searchParams.get('level') ?? '')
  const [access, setAccess] = useState(searchParams.get('access') ?? '')
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'popular')

  const handleApply = useCallback(() => {
    const p = new URLSearchParams()
    const q = searchParams.get('q')
    if (q) p.set('q', q)
    if (topic) p.set('topic', topic)
    if (level) p.set('level', level)
    if (access) p.set('access', access)
    if (sort && sort !== 'popular') p.set('sort', sort)
    router.push(`/explore?${p.toString()}`)
    onClose()
  }, [topic, level, access, sort, searchParams, router, onClose])

  const handleClear = useCallback(() => {
    setTopic('')
    setLevel('')
    setAccess('')
    setSort('popular')
  }, [])

  const activeCount = [topic, level, access].filter(Boolean).length

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl md:left-auto md:top-0 md:bottom-0 md:w-[320px] md:rounded-t-none md:rounded-l-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-5 py-5">
              {/* Topic */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Topic</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTopic('')}
                    className={cn(
                      'rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                      !topic ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    All Topics
                  </button>
                  {topics.map((t) => (
                    <button
                      key={t.slug}
                      onClick={() => setTopic(topic === t.slug ? '' : t.slug)}
                      className={cn(
                        'rounded-lg px-3 py-2 text-xs font-medium transition-colors text-left truncate',
                        topic === t.slug ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {t.icon} {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Level</p>
                <div className="flex gap-2">
                  {LEVELS.map((lv) => (
                    <button
                      key={lv.value}
                      onClick={() => setLevel(lv.value)}
                      className={cn(
                        'flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                        level === lv.value ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {lv.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Access */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Access</p>
                <div className="flex gap-2">
                  {ACCESS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAccess(opt.value)}
                      className={cn(
                        'flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                        access === opt.value ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Sort</p>
                <div className="flex gap-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSort(opt.value)}
                      className={cn(
                        'flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                        sort === opt.value ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-between border-t border-gray-100 bg-white px-5 py-4">
              <button onClick={handleClear} className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Clear All{activeCount > 0 && ` (${activeCount})`}
              </button>
              <Button
                onClick={handleApply}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground)',
                  borderRadius: 'var(--button-radius)',
                }}
              >
                Show {totalCount} courses
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
