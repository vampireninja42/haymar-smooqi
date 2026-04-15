'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { themeConfig } from '@/lib/theme'
import { cn } from '@/lib/utils'

type UserSettings = {
  provider: string
  themeMode: string
  notificationsEnabled: boolean
  subscriptionStatus: string
  subscriptionPlan: string | null
}

const THEME_MODES = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
] as const

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)

  // Theme
  const [themeMode, setThemeMode] = useState('light')

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Notifications
  const [notifications, setNotifications] = useState(false)

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
          setThemeMode(data.themeMode)
          setNotifications(data.notificationsEnabled)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  async function handleThemeChange(mode: string) {
    setThemeMode(mode)
    await fetch('/api/user/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeMode: mode }),
    })
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
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Appearance */}
      <div
        className={`rounded-[var(--card-radius)] p-4 shadow-sm ${
          themeConfig.isVA ? 'glass-card' : 'bg-white'
        }`}
      >
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Appearance</h3>
        <div className="flex gap-2">
          {THEME_MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => handleThemeChange(mode.value)}
              className={cn(
                'flex-1 rounded-[var(--button-radius)] px-3 py-2.5 text-sm font-medium transition-colors border',
                themeMode === mode.value
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-gray-900'
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              )}
            >
              <span className="mr-1">{mode.icon}</span> {mode.label}
            </button>
          ))}
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
