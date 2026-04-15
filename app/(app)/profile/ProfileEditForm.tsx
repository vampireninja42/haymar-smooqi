'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { themeConfig } from '@/lib/theme'

export function ProfileEditForm({ currentName }: { currentName: string }) {
  const router = useRouter()
  const [name, setName] = useState(currentName)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (res.ok) {
        setMessage('Profile updated!')
        router.refresh()
      } else {
        setMessage('Failed to update profile.')
      }
    } catch {
      setMessage('An error occurred.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
        themeConfig.isVA ? 'glass-card' : 'bg-white'
      }`}
    >
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Edit Profile</h3>

      <div className="space-y-3">
        <div>
          <Label htmlFor="name" className="text-xs text-gray-600">
            Display Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-1"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={saving || !name.trim() || name.trim() === currentName}
            size="sm"
            className="rounded-[var(--button-radius)]"
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>

          {message && (
            <span className="text-xs text-gray-500">{message}</span>
          )}
        </div>
      </div>
    </div>
  )
}
