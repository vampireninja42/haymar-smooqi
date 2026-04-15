'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TopicData {
  id: string
  slug: string
  name: string
  icon: string
}

interface TopicSelectorProps {
  allTopics: TopicData[]
  selectedSlugs: string[]
}

export function TopicSelector({ allTopics, selectedSlugs }: TopicSelectorProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedSlugs))
  const [saving, setSaving] = useState(false)

  function toggleTopic(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        if (next.size <= 1) return prev // min 1 topic
        next.delete(slug)
      } else {
        if (next.size >= 5) return prev // max 5
        next.add(slug)
      }
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    const added = Array.from(selected).filter((s) => !selectedSlugs.includes(s))
    const removed = selectedSlugs.filter((s) => !selected.has(s))

    for (const slug of added.concat(removed)) {
      await fetch(`/api/topics/${slug}/toggle`, { method: 'POST' }).catch(() => {})
    }

    setSaving(false)
    setIsOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="rounded-full text-xs"
      >
        + Add topics
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
                <h2 className="text-lg font-bold text-gray-900">Select Topics</h2>
                <button onClick={() => setIsOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 p-5">
                {allTopics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleTopic(t.slug)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors',
                      selected.has(t.slug)
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-gray-900'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span className="flex-1 truncate">{t.name}</span>
                    {selected.has(t.slug) && <span className="text-xs">{'\u2713'}</span>}
                  </button>
                ))}
              </div>

              <div className="sticky bottom-0 flex items-center justify-between border-t border-gray-100 bg-white px-5 py-4">
                <p className="text-xs text-gray-500">{selected.size}/5 selected</p>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-primary-foreground)',
                    borderRadius: 'var(--button-radius)',
                  }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
