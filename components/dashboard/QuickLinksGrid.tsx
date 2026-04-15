'use client'

import Link from 'next/link'
import { themeConfig } from '@/lib/theme'

const links = [
  { label: 'Explore', href: '/explore', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', icon: '\uD83D\uDD0D' },
  { label: 'Leaderboard', href: '/leaderboard', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', icon: '\uD83C\uDFC6' },
  { label: 'Word Games', href: '/word-games', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', icon: '\uD83C\uDFAE' },
  { label: 'Achievements', href: '/achievements', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', icon: '\uD83C\uDFC5' },
  { label: 'Reports', href: '/reports', gradient: 'linear-gradient(135deg, #fa709a, #fee140)', icon: '\uD83D\uDCCA' },
  { label: 'Invite Friends', href: '/invite', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', icon: '\uD83C\uDF81' },
]

export function QuickLinksGrid() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`flex flex-col items-center py-4 px-3 rounded-xl transition-shadow hover:shadow-md ${
            themeConfig.isVA ? 'glass-card' : 'bg-white shadow-sm'
          }`}
        >
          <span
            className="h-12 w-12 rounded-2xl flex items-center justify-center"
            style={{ background: l.gradient }}
          >
            <span className="text-2xl">{l.icon}</span>
          </span>
          <span className="text-xs font-medium text-gray-700 mt-2">{l.label}</span>
        </Link>
      ))}
    </div>
  )
}
