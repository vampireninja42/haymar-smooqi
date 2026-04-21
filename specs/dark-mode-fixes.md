# Spec: Dark Mode Fixes — Default Light, Notification Contrast, Full Audit

---

## Fix 1 — Default to Light mode (not System)

### `app/layout.tsx` — init script
Change the early-init script so it only applies dark class if the user has explicitly saved `'dark'`. Remove the `system` / `prefers-color-scheme` fallback:

```ts
// Change from:
`try { var t = localStorage.getItem('smooqi-theme'); if (t === 'dark' || ((!t || t === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) { document.documentElement.classList.add('dark'); } } catch(e) {}`

// Change to:
`try { if (localStorage.getItem('smooqi-theme') === 'dark') { document.documentElement.classList.add('dark'); } } catch(e) {}`
```

### `app/(app)/settings/page.tsx`
- Change default state from `'system'` to `'light'`:
  ```ts
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light')
  ```
- In `applyThemeMode`, for `'system'` mode, default to light (remove prefers-color-scheme check or treat system = light):
  ```ts
  function applyThemeMode(mode: 'light' | 'dark' | 'system') {
    localStorage.setItem('smooqi-theme', mode)
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      // both 'light' and 'system' default to light
      document.documentElement.classList.remove('dark')
    }
  }
  ```

---

## Fix 2 — Notification popover hard to read in dark mode

**File:** `app/globals.css`

The notification popover uses `bg-white`, `text-gray-900`, `border-gray-100` — all override to dark colors in dark mode. Add explicit dark overrides:

```css
.dark .notification-popover {
  background-color: #2a2a2a !important;
  border-color: #444 !important;
}
.dark .notification-popover p,
.dark .notification-popover span {
  color: #f0f0f0 !important;
}
.dark .notification-popover .text-gray-400 {
  color: #a0a0a0 !important;
}
.dark .notification-popover .hover\:bg-gray-50:hover {
  background-color: #333 !important;
}
.dark .notification-popover .border-b {
  border-color: #444 !important;
}
```

**File:** `components/ui/NotificationPopover.tsx`

Add `notification-popover` class to the dropdown container:
```tsx
className="notification-popover absolute right-0 top-full mt-2 w-64 rounded-xl bg-white shadow-xl border border-gray-100 z-50 overflow-hidden"
```

---

## Fix 3 — Full dark mode audit — add missing overrides to `globals.css`

The current dark CSS only covers a handful of classes. Add comprehensive overrides for all components:

```css
/* Cards and containers */
.dark .rounded-2xl,
.dark .rounded-xl,
.dark [class*="rounded-"][class*="bg-white"] {
  background-color: #1e1e1e !important;
}

/* Form inputs */
.dark input,
.dark textarea,
.dark select {
  background-color: #2a2a2a !important;
  border-color: #444 !important;
  color: #f0f0f0 !important;
}
.dark input::placeholder,
.dark textarea::placeholder {
  color: #777 !important;
}

/* Buttons */
.dark button.bg-white,
.dark .bg-gray-50 { background-color: #2a2a2a !important; }
.dark .bg-gray-100 { background-color: #333 !important; }
.dark .hover\:bg-gray-50:hover { background-color: #2a2a2a !important; }
.dark .hover\:bg-gray-100:hover { background-color: #333 !important; }

/* Text */
.dark .text-gray-800 { color: #e8e8e8 !important; }
.dark .text-gray-600 { color: #c0c0c0 !important; }
.dark .text-gray-400 { color: #888 !important; }

/* Borders */
.dark .border-gray-100 { border-color: #2a2a2a !important; }
.dark .border-gray-300 { border-color: #555 !important; }

/* Badges */
.dark .bg-green-100 { background-color: #1a3a2a !important; }
.dark .bg-blue-50 { background-color: #1a2a3a !important; }
.dark .bg-red-50 { background-color: #3a1a1a !important; }
.dark .bg-yellow-50 { background-color: #3a3a1a !important; }

/* Sidebar/AppShell */
.dark [style*="--sidebar-bg"] {
  --sidebar-bg: rgba(20, 20, 20, 0.95) !important;
}

/* Progress bars */
.dark .bg-gray-100.rounded-full { background-color: #333 !important; }

/* Separator */
.dark [role="separator"],
.dark .border-t { border-color: #333 !important; }

/* Sticky nav/header */
.dark .bg-white\/90,
.dark .backdrop-blur-sm.bg-white\/90 {
  background-color: rgba(20, 20, 20, 0.92) !important;
}

/* Quiz explanation card */
.dark .bg-blue-50.rounded-xl {
  background-color: #1a2535 !important;
  border-color: #2a4060 !important;
}
.dark .bg-blue-50 .text-gray-700 { color: #c8d8e8 !important; }

/* Settings page cards */
.dark .glass-card {
  background: rgba(30, 30, 30, 0.92) !important;
  border-color: rgba(255,255,255,0.08) !important;
}

/* Muted foreground */
.dark .text-muted-foreground { color: #a0a0a0 !important; }
.dark .bg-muted\/30 { background-color: #1a1a1a !important; }
```

---

## Constraints
- No changes to DB, API routes, auth, or middleware
- No changes to vB layout (vB has its own color system)
- TypeScript must compile clean
- Dark mode changes are CSS-only — no server-side rendering changes

## Verification
- New users (no localStorage) → light mode by default
- Existing users who chose 'system' → light mode on next visit
- Notification popover in dark mode: white text on dark background, readable
- Cards, inputs, buttons all readable in dark mode
- Quiz explanation card readable in dark mode
- No white-on-white or dark-on-dark text anywhere obvious
