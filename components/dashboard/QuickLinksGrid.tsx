'use client'

import Link from 'next/link'

const links = [
  { label: 'Explore', href: '/explore', icon: '\uD83D\uDD0D', color: '#EEF2FF' },
  { label: 'Word Games', href: '/word-games', icon: '\uD83C\uDFAE', color: '#F0FDF4' },
  { label: 'Leaderboard', href: '/leaderboard', icon: '\uD83C\uDFC6', color: '#FFFBEB' },
  { label: 'Saved', href: '/saved', icon: '\uD83D\uDCCC', color: '#FEF2F2' },
]

export function QuickLinksGrid() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="flex flex-col items-center gap-1 rounded-[var(--card-radius)] bg-white p-2 shadow-sm transition-shadow hover:shadow-md"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-base"
            style={{ backgroundColor: l.color }}
          >
            {l.icon}
          </span>
          <span className="text-[11px] font-medium text-gray-700">{l.label}</span>
        </Link>
      ))}
    </div>
  )
}
