'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { themeConfig } from '@/lib/theme'
import { cn } from '@/lib/utils'
import { BackButton } from '@/components/ui/BackButton'
import { VOICE_KEYS, VOICE_LABELS, DEFAULT_VOICE_KEY } from '@/lib/voiceMap'

type UserSettings = {
  provider: string
  themeMode: string
  notificationsEnabled: boolean
  preferredVoice: string
  subscriptionStatus: string
  subscriptionPlan: string | null
}

const THEME_COLORS = [
  { id: 'purple', label: 'Purple', primary: '#7C3AED', light: '#EDE9FE' },
  { id: 'blue', label: 'Blue', primary: '#2563EB', light: '#EFF6FF' },
  { id: 'green', label: 'Green', primary: '#059669', light: '#F0FDF4' },
  { id: 'orange', label: 'Orange', primary: '#F97316', light: '#FFF7ED' },
  { id: 'pink', label: 'Pink', primary: '#EC4899', light: '#FDF2F8' },
  { id: 'teal', label: 'Teal', primary: '#0D9488', light: '#F0FDFA' },
]

const PATTERNS = [
  { id: 'solid', label: 'Solid' },
  { id: 'dots', label: 'Dots' },
  { id: 'grid', label: 'Grid' },
  { id: 'diagonals', label: 'Diagonals' },
  { id: 'waves', label: 'Waves' },
]

const COLOR_MAP: Record<string, string> = {
  purple: '#7C3AED',
  blue: '#2563EB',
  green: '#059669',
  rose: '#E11D48',
  orange: '#EA580C',
  teal: '#0D9488',
  pink: '#EC4899',
}

const PATTERN_STYLES: Record<string, string> = {
  solid: '',
  dots: 'radial-gradient(circle, rgba(124,58,237,0.35) 1.5px, transparent 1.5px)',
  grid: 'linear-gradient(rgba(124,58,237,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.10) 1px, transparent 1px)',
  diagonals: 'repeating-linear-gradient(45deg, rgba(124,58,237,0.08) 0px, rgba(124,58,237,0.08) 2px, transparent 2px, transparent 12px)',
  waves: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='20'%3E%3Cpath d='M0 10 Q25 0 50 10 Q75 20 100 10' fill='none' stroke='rgba(124%2C58%2C237%2C0.25)' stroke-width='1.5'/%3E%3C/svg%3E\")",
}

const PATTERN_SIZES: Record<string, string> = {
  dots: '24px 24px',
  grid: '40px 40px',
  diagonals: '14px 14px',
  waves: '100px 20px',
}

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)

  // Theme
  const [themeColor, setThemeColor] = useState('purple')
  const [bgPattern, setBgPattern] = useState('solid')

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Notifications
  const [notifications, setNotifications] = useState(false)

  // Audio
  const [preferredVoice, setPreferredVoice] = useState<string>(DEFAULT_VOICE_KEY)
  const [voiceSavedAt, setVoiceSavedAt] = useState<number | null>(null)

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/user/settings')
        if (res.ok) {
          const data = await res.json()
          setSettings(data)
          setThemeColor(data.themeColor ?? 'purple')
          setBgPattern(data.backgroundPattern ?? 'solid')
          setNotifications(data.notificationsEnabled)
          if (typeof data.preferredVoice === 'string' && VOICE_KEYS.includes(data.preferredVoice)) {
            setPreferredVoice(data.preferredVoice)
          }
          // Apply saved pattern CSS vars on mount
          const savedPattern = data.backgroundPattern ?? 'solid'
          const savedStyle = PATTERN_STYLES[savedPattern] ?? ''
          if (savedPattern !== 'solid' && savedStyle) {
            document.documentElement.style.setProperty('--bg-pattern', savedStyle)
            document.documentElement.style.setProperty('--bg-pattern-size', PATTERN_SIZES[savedPattern] ?? 'auto')
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  async function handleThemeColorChange(color: string) {
    setThemeColor(color)
    // Apply live
    const hex = COLOR_MAP[color] ?? '#7C3AED'
    document.documentElement.style.setProperty('--color-primary', hex)
    await fetch('/api/user/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeColor: color }),
    })
  }

  async function handlePatternChange(pattern: string) {
    setBgPattern(pattern)
    const style = PATTERN_STYLES[pattern] ?? ''
    if (pattern === 'solid' || !style) {
      document.documentElement.style.setProperty('--bg-pattern', 'none')
      document.documentElement.style.setProperty('--bg-pattern-size', 'auto')
    } else {
      document.documentElement.style.setProperty('--bg-pattern', style)
      document.documentElement.style.setProperty('--bg-pattern-size', PATTERN_SIZES[pattern] ?? 'auto')
    }
    await fetch('/api/user/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backgroundPattern: pattern }),
    })
  }

  async function handleVoiceChange(voice: string) {
    if (!VOICE_KEYS.includes(voice) || voice === preferredVoice) return
    setPreferredVoice(voice)
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredVoice: voice }),
      })
      if (res.ok) {
        setVoiceSavedAt(Date.now())
        setTimeout(() => {
          setVoiceSavedAt((t) => (t && Date.now() - t >= 1800 ? null : t))
        }, 2000)
      }
    } catch {
      // ignore — user can retry
    }
  }

  async function handleNotificationsToggle() {
    const next = !notifications
    setNotifications(next)
    await fetch('/api/user/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationsEnabled: next }),
    })
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match.')
      return
    }
    if (newPassword.length < 8) {
      setPasswordMsg('Password must be at least 8 characters.')
      return
    }

    setPasswordSaving(true)
    setPasswordMsg('')

    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (res.ok) {
        setPasswordMsg('Password updated!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const data = await res.json().catch(() => ({}))
        setPasswordMsg(data.error ?? 'Failed to update password.')
      }
    } catch {
      setPasswordMsg('An error occurred.')
    } finally {
      setPasswordSaving(false)
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') return
    setDeleting(true)

    try {
      const res = await fetch('/api/user/account', { method: 'DELETE' })
      if (res.ok) {
        router.push('/login')
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <BackButton href="/home" />
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Appearance */}
      <div
        className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
          themeConfig.isVA ? 'glass-card' : 'bg-white'
        }`}
      >
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Theme Color</h3>
        <div className="flex gap-3">
          {THEME_COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => handleThemeColorChange(c.id)}
              className={cn(
                'relative h-8 w-8 rounded-full transition-all',
                themeColor === c.id ? 'ring-2 ring-offset-2' : 'hover:scale-110'
              )}
              style={{
                backgroundColor: c.primary,
                outlineColor: c.primary,
              }}
              aria-label={c.label}
            >
              {themeColor === c.id && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">{'\u2713'}</span>
              )}
            </button>
          ))}
        </div>

        <h3 className="mb-3 mt-5 text-sm font-semibold text-gray-700">Background</h3>
        <div className="flex gap-2">
          {PATTERNS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePatternChange(p.id)}
              className={cn(
                'flex-1 rounded-lg border px-2 py-2 text-[11px] font-medium transition-colors text-center',
                bgPattern === p.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-gray-900'
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-3">
          {'\uD83D\uDCA1'} Theme changes apply instantly.
        </p>
      </div>

      {/* Audio */}
      <div
        className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
          themeConfig.isVA ? 'glass-card' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Audio</h3>
          {voiceSavedAt && Date.now() - voiceSavedAt < 1800 && (
            <span className="text-xs text-[var(--color-primary)]">Saved</span>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">Lesson Voice</p>
        <div
          role="radiogroup"
          aria-label="Lesson Voice"
          className="mt-3 space-y-2"
        >
          {VOICE_KEYS.map((key) => {
            const selected = preferredVoice === key
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => handleVoiceChange(key)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  selected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-gray-900'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                )}
              >
                <span>{VOICE_LABELS[key]}</span>
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-full border',
                    selected
                      ? 'border-[var(--color-primary)]'
                      : 'border-gray-300'
                  )}
                  aria-hidden
                >
                  {selected && (
                    <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Account - Change Password (email users only) */}
      {settings?.provider === 'email' && (
        <div
          className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
            themeConfig.isVA ? 'glass-card' : 'bg-white'
          }`}
        >
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Change Password
          </h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="current-password" className="text-xs text-gray-600">
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-password" className="text-xs text-gray-600">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-xs text-gray-600">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleChangePassword}
                disabled={passwordSaving || !currentPassword || !newPassword}
                size="sm"
                className="rounded-[var(--button-radius)]"
              >
                {passwordSaving ? 'Saving...' : 'Update Password'}
              </Button>
              {passwordMsg && (
                <span className="text-xs text-gray-500">{passwordMsg}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subscription */}
      <div
        className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
          themeConfig.isVA ? 'glass-card' : 'bg-white'
        }`}
      >
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Subscription</h3>
        <p className="text-sm text-gray-600">
          {settings?.subscriptionStatus === 'active'
            ? `Premium ${settings.subscriptionPlan ?? ''} plan`
            : settings?.subscriptionStatus === 'trialing'
              ? 'Free trial active'
              : 'Free plan'}
        </p>
        <Button
          onClick={() => router.push('/settings/subscription')}
          variant="outline"
          size="sm"
          className="mt-2 rounded-[var(--button-radius)]"
        >
          Manage Subscription
        </Button>
      </div>

      {/* Notifications */}
      <div
        className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
          themeConfig.isVA ? 'glass-card' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
            <p className="text-xs text-gray-500">Receive learning reminders</p>
          </div>
          <button
            onClick={handleNotificationsToggle}
            className={cn(
              'relative h-6 w-11 rounded-full transition-colors',
              notifications ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                notifications ? 'translate-x-5' : 'translate-x-0.5'
              )}
            />
          </button>
        </div>
      </div>

      {/* Help */}
      <div
        className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
          themeConfig.isVA ? 'glass-card' : 'bg-white'
        }`}
      >
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Help</h3>
        <div className="space-y-2">
          <a
            href="/support"
            className="block text-sm text-[var(--color-primary)] hover:underline"
          >
            Contact Support
          </a>
          <a
            href="/faq"
            className="block text-sm text-[var(--color-primary)] hover:underline"
          >
            FAQ
          </a>
          <a
            href="/privacy"
            className="block text-sm text-[var(--color-primary)] hover:underline"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="block text-sm text-[var(--color-primary)] hover:underline"
          >
            Terms of Service
          </a>
        </div>
      </div>

      <Separator />

      {/* Danger Zone */}
      <div className="rounded-[var(--card-radius)] border border-red-200 bg-red-50 p-4">
        <h3 className="mb-1 text-sm font-semibold text-red-700">Danger Zone</h3>
        <p className="mb-3 text-xs text-red-600">
          Permanently delete your account and all associated data.
        </p>
        <Button
          onClick={() => setShowDeleteModal(true)}
          variant="destructive"
          size="sm"
          className="rounded-[var(--button-radius)]"
        >
          Delete Account
        </Button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-[var(--card-radius)] bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
            <p className="mt-2 text-sm text-gray-600">
              This action is permanent and cannot be undone. All your data including
              progress, achievements, and subscriptions will be deleted.
            </p>
            <div className="mt-4">
              <Label htmlFor="delete-confirm" className="text-xs text-gray-600">
                Type DELETE to confirm
              </Label>
              <Input
                id="delete-confirm"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="mt-1"
              />
            </div>
            <div className="mt-4 flex gap-3">
              <Button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirm('')
                }}
                variant="outline"
                size="sm"
                className="rounded-[var(--button-radius)]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || deleting}
                variant="destructive"
                size="sm"
                className="rounded-[var(--button-radius)]"
              >
                {deleting ? 'Deleting...' : 'Delete My Account'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
