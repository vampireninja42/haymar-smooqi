# Spec: UX Fixes Batch 2 — 12 Issues

---

## Fix 1 — Explore "Load More" resets scroll to top

**Root cause:** "Load more" uses a `<Link href="...?page=2">` which is a full navigation — Next.js scrolls to top on page change.

**File:** `app/(app)/explore/page.tsx`

Replace the `<Link>` load-more button with a client-side approach. Convert the explore page's load-more to use a client component that appends results via `fetch` without navigating:

1. Extract the course grid + load more button into a new client component `components/explore/CourseGrid.tsx`
2. It receives `initialCourses`, `hasMore`, `initialPage`, and current filter params as props
3. On "Load More" click, fetch `/api/courses?page=N&...` (create this endpoint or use existing search params) and append to local state — do NOT navigate
4. Scroll position is preserved because no navigation occurs

Alternatively (simpler): convert `<Link>` to a `<button>` that uses `router.push(url, { scroll: false })`:
```tsx
<button onClick={() => router.push(filterUrl({ page: String(page + 1) }), { scroll: false })}>
  Load More
</button>
```
Use `{ scroll: false }` on the router push — this is the minimal fix.

---

## Fix 2 — Back button goes to wrong page

**Root cause:** `BackButton` always calls `router.back()` which pops browser history — after completing a lesson/quiz, history may point to mid-lesson states.

**File:** `components/ui/BackButton.tsx`

Change `BackButton` to always use `href` when provided, ignoring history:

```tsx
function handleBack() {
  if (href) {
    router.push(href)
  } else if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/home')
  }
}
```

This means callers that pass `href` always get a deterministic destination. Audit all `BackButton` usages in lesson/quiz/game pages and ensure `href` is always passed with the correct destination:
- Lesson pages: `href={/learn/${courseSlug}}`
- Course page: `href={/topics/${topicSlug}}`  
- Word game pages: `href="/word-games"`
- Settings sub-pages: `href="/settings"`

---

## Fix 3 — Fill the Blank answer options not centered

**File:** `components/word-games/FillBlank.tsx`

The 2×2 grid options use `text-left` alignment. For short words/phrases in a fill-the-blank game, centered text looks better.

Change option buttons from `text-left` to `text-center`, and update the inner layout:
```tsx
<motion.button className={cn('w-full text-center p-4 rounded-xl border transition-all', getCardStyle(index))}>
  <div className="flex flex-col items-center gap-2">
    <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
      {LETTERS[index]}
    </span>
    <span className="text-gray-800 text-sm leading-relaxed">{option}</span>
    {/* feedback icons */}
  </div>
</motion.button>
```

---

## Fix 4 — Achievement celebration after game completion

**File:** `components/word-games/GameSummary.tsx`

After XP is posted, call `checkAndUnlockAchievements` via a new API endpoint, then show any newly unlocked achievements.

Add after the XP fetch in `useEffect`:
```ts
const xpRes = await fetch('/api/xp', { ... })
const xpData = await xpRes.json()
if (xpData.newAchievements?.length > 0) {
  // Store in state and show below the score
  setNewAchievements(xpData.newAchievements)
}
```

The `/api/xp` endpoint already returns `newAchievements` — just consume it. Add a `useState<Achievement[]>` and render them below the score with the same achievement badge style used in `LessonComplete` / `QuizSummary`. The XP endpoint already handles achievement checking server-side.

---

## Fix 5 — Round indicator dots show score, not current round

**File:** `components/word-games/GameHeader.tsx`

**Current behavior:** Dots turn green when `i < score` — shows how many you got right.
**Correct behavior:** Dots should indicate current position — past rounds filled, current round highlighted, future rounds empty.

Fix:
```tsx
{Array.from({ length: totalRounds }).map((_, i) => (
  <motion.div
    key={i}
    className={cn('w-3 h-3 rounded-full border-2 transition-colors',
      i < currentRound - 1  // completed rounds
        ? 'border-green-500 bg-green-500'
        : i === currentRound - 1  // current round
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
          : 'border-gray-300 bg-white'  // upcoming
    )}
  />
))}
```

Apply equivalent logic for vB styles.

---

## Fix 6 — Word Search all answers appear correct

**File:** `components/word-games/WordSearch.tsx`

**Root cause:** In feedback phase, ALL selected words turn green (`isSelected ? 'bg-green-100 border-green-400' : ...`). There's no distinction between correctly and incorrectly selected words.

The `conceptWords` array contains ALL the words in the round — they're all the "concept words" to find. The scoring logic (`allSelected = selectedWords.size === conceptWords.length`) only scores correct if the user selected ALL words. But visually, selecting any word turns it green.

**Fix:** The game needs a different data shape OR a different win condition. Since the data only has `conceptWords` (all correct), change the visual feedback to:
- Show which words the user selected vs missed
- Green = user selected it (correct — it IS a concept word)  
- Red outline = concept word the user MISSED (didn't select)
- All words in `conceptWords` are correct to select

```tsx
// In feedback phase:
const isSelected = selectedWords.has(i)
// All conceptWords are correct — show missed ones in red
className={cn(
  'px-4 py-2 rounded-lg border text-sm font-medium',
  phase === 'feedback'
    ? isSelected
      ? 'bg-green-100 border-green-400 text-green-800'  // selected correctly
      : 'bg-red-50 border-red-300 text-red-600'         // missed
    : isSelected
      ? 'bg-primary text-white border-primary'
      : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300'
)}
```

Also update scoring: award partial credit — `score += selectedWords.size / conceptWords.length` rounded, or keep binary but make the feedback clearly show missed words.

---

## Fix 7 — Topic selection modal scroll doesn't translate to page scroll on mobile

**File:** `app/(app)/settings/page.tsx` or `components/profile/TopicSelector.tsx`

The topic selector is likely a modal/drawer with its own scroll context. On mobile, when the inner modal scroll hits the top/bottom, it doesn't chain to the page scroll — users get stuck.

**Fix:** Add `overscroll-behavior: contain` to the modal's scrollable container AND ensure the modal uses `position: fixed` with `overflow-y: auto` and explicit height:

```tsx
<div 
  className="overflow-y-auto overscroll-contain"
  style={{ maxHeight: '70vh', WebkitOverflowScrolling: 'touch' }}
>
  {/* topic grid */}
</div>
```

Also add a clear "Done" / close button at the bottom of the modal so users don't need to scroll back up to close it.

---

## Fix 8 — Missing pages: FAQ, Privacy Policy, Terms of Service

Settings links point to `/faq`, `/privacy`, `/terms` — these pages don't exist (404).

Create these as simple public pages under `app/(public)/`:

**`app/(public)/faq/page.tsx`**
- Title: "Frequently Asked Questions"
- 6–8 FAQ items covering: what is Smooqi, how does learning work, how do streaks work, what is Premium, how do I cancel, how do referrals work, how do I change my topics
- Accordion-style or simple Q&A list
- Back link to home

**`app/(public)/privacy/page.tsx`**
- Title: "Privacy Policy"
- Standard privacy policy covering: data collected (email, usage), how it's used, third-party services (Google OAuth, Stripe, Upstash), data retention, contact info
- Last updated: April 2026
- Back link to home

**`app/(public)/terms/page.tsx`**
- Title: "Terms of Service"  
- Standard terms covering: service description, user accounts, acceptable use, subscription/billing, termination, limitation of liability
- Last updated: April 2026
- Back link to home

All three pages should use the public layout (Header + Footer) and match the app's visual style.

---

## Fix 9 — Notification toggle misformatted on mobile (Settings)

**File:** `app/(app)/settings/page.tsx`

The toggle section likely has a flex layout that breaks on narrow screens. Find the notifications toggle row and ensure it uses:
```tsx
<div className="flex items-center justify-between gap-4">
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-gray-900">Push Notifications</p>
    <p className="text-xs text-gray-500 mt-0.5">Get reminders for your daily lesson</p>
  </div>
  <button
    onClick={handleToggleNotifications}
    className="flex-shrink-0 relative w-11 h-6 rounded-full transition-colors focus:outline-none"
    ...
  >
```

The key fix: `flex-shrink-0` on the toggle button and `min-w-0` on the text side so text truncates instead of pushing the toggle off screen.

---

## Fix 10 — Dark mode toggle in Settings

**Add dark mode support:**

1. In `app/(app)/settings/page.tsx`, add a "Appearance" section with Light / Dark / System options (3 buttons, same style as theme color picker).

2. Store preference in `localStorage` as `smooqi-theme` (`'light' | 'dark' | 'system'`).

3. In `app/layout.tsx`, add a script tag that reads `localStorage` and sets `class="dark"` on `<html>` before first render (prevents flash):
```html
<script dangerouslySetInnerHTML={{ __html: `
  try {
    const t = localStorage.getItem('smooqi-theme')
    if (t === 'dark' || (!t || t === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    }
  } catch(e) {}
` }} />
```

4. Add basic dark mode CSS variables in `globals.css`:
```css
.dark body {
  background: #0f0f0f !important;
  color: #f5f5f5;
}
.dark .glass-card {
  background: rgba(30, 30, 30, 0.85) !important;
  border-color: rgba(255,255,255,0.1) !important;
}
.dark .bg-white { background-color: #1e1e1e !important; }
.dark .text-gray-900 { color: #f5f5f5 !important; }
.dark .text-gray-700 { color: #d1d1d1 !important; }
.dark .text-gray-500 { color: #a0a0a0 !important; }
.dark .border-gray-200 { border-color: #333 !important; }
```

5. The settings component reads from `localStorage` and updates both `localStorage` and the `<html>` class on change.

---

## Fix 11 — Footer links have no content (Privacy, Terms, FAQ)

Covered by Fix 8 — creating those pages will make footer links work. No additional changes needed to Footer component.

Also verify the `/about` page exists — if not, create a minimal `app/(public)/about/page.tsx` with a brief "About Smooqi" blurb.

---

## Constraints
- No changes to DB schema, API routes (except consuming existing xp endpoint response), auth, or middleware
- All new pages use the existing public layout (`app/(public)/layout.tsx`)  
- Dark mode is CSS-only — no server-side theme switching required
- TypeScript must compile clean
- Fix 1 (`{ scroll: false }`) is the minimal correct fix — do not over-engineer load-more into a full client component unless the simple fix doesn't work

## Verification
- Load More on explore: scroll position stays put
- Back button from lesson → goes to course page, not mid-lesson
- Fill the Blank options: centered, readable on mobile
- Game summary: shows achievement unlock if earned
- Round dots: show current position not score
- Word Search feedback: missed words shown in red
- Topic selector: "Done" button visible without scrolling back up
- /faq, /privacy, /terms: all load with real content
- Settings notification toggle: clean layout on 375px width
- Dark mode: toggling in settings switches the app
- Footer links work

---

## Fix 13 — Notification dot persists after opening + drawer too large

Already fixed directly in code (not Claude needed):
- Dot clears on open via `dismissed` state
- Drawer width reduced from `w-80` to `w-64`
- Max height reduced from `max-h-72` to `max-h-56`
- Notifications capped at 4 entries

---

## Fix 14 — "Rate Us" leads to support form — create feedback/rating page

**File:** `components/dashboard/NotificationPrompts.tsx` — already updated to link to `/feedback`

**Create:** `app/(app)/feedback/page.tsx`

A simple in-app rating page (not a support form):
- Star rating: 1–5 stars (tap to select)
- Optional short text field: "Tell us more (optional)"
- Submit button
- On submit: POST to `/api/feedback` which stores in DB or sends via Resend to `hello@haymar.ai`
- Success state: "Thanks for your feedback! 🙏"
- Back button → `/home`

**Create:** `app/api/feedback/route.ts`
- Accepts `{ rating: number, message?: string }`
- Rate limit (use existing `apiRateLimit`)
- Send email via Resend to `hello@haymar.ai` with rating + message + user email
- Return `{ success: true }`

Style: match app brand, centered card layout, star buttons using `⭐` or SVG stars colored with `var(--color-primary)`.
