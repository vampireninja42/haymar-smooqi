# Spec: Mobile Optimization

## Bug 1 — Quiz correct answer always in position B

**Root cause:** `QuizQuestion.tsx` renders options in fixed A/B/C/D order. The content was authored with `correctAnswer: "B"` for most questions because the import script always puts the correct answer in position B (index 1 in the `correctIndex` field maps to `optionB`).

**Fix — shuffle options at render time:**

In `QuizQuestion.tsx`, before rendering, shuffle the 4 options and remap `correctAnswer` to the shuffled position. Use a `useMemo` so it only shuffles once per question mount:

```ts
const shuffled = useMemo(() => {
  const entries = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD },
  ]
  // Fisher-Yates shuffle
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[entries[i], entries[j]] = [entries[j], entries[i]]
  }
  // Find which new position holds the original correct answer
  const correctText = question[`option${question.correctAnswer}` as keyof typeof question]
  const newCorrectKey = OPTION_KEYS[entries.findIndex(e => e.text === correctText)]
  return { entries, correctKey: newCorrectKey }
}, [question])
```

Use `shuffled.entries` for rendering options and `shuffled.correctKey` instead of `question.correctAnswer` for comparison. Apply to both vA and vB layouts.

---

## Bug 2 — Page scrolls to bottom on lesson load

**Root cause:** When navigating to a lesson, the browser restores scroll position or the animation exit/enter causes layout shift that pushes scroll down.

**Fix — scroll to top on slide change and on initial mount:**

In `LessonPlayer.tsx`, add a `useEffect` that fires on `state.currentSlide` change and on phase change:

```ts
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'instant' })
}, [state.currentSlide, state.phase])
```

Also add `scroll="false"` behaviour via Next.js `<Link>` tags that navigate to lesson pages (in `CourseOverview.tsx` and anywhere else lesson links appear) — but the primary fix is the `scrollTo` in `LessonPlayer`.

---

## Bug 3 — Slide animation rigid on mobile

**Root cause:** `mode="popLayout"` causes the exiting element to be removed from layout immediately, creating a height collapse that feels jarring on mobile. The spring settings are too stiff for mobile viewport widths.

**Fix:**

Change `AnimatePresence` from `mode="popLayout"` to `mode="wait"` — this waits for the exit animation to complete before mounting the next slide, preventing layout collapse:

```tsx
<AnimatePresence mode="wait" custom={direction} initial={false}>
```

Update slide variants to use percentage-based offsets and softer spring:

```ts
const slideVariants = {
  enter: (d: number) => ({
    x: d > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (d: number) => ({
    x: d > 0 ? '-30%' : '30%',
    opacity: 0,
  }),
}
```

Update transition:
```ts
transition={{
  x: { type: 'spring', stiffness: 220, damping: 28, mass: 0.6 },
  opacity: { duration: 0.15, ease: 'easeOut' },
}}
```

The exit slides out only 30% (not full width) — this creates a parallax depth effect that feels native and smooth on mobile. The enter comes from full width for clear directionality.

Wrap the `AnimatePresence` container in `overflow-hidden` to prevent the entering slide from causing horizontal scroll:

```tsx
<div className="relative overflow-hidden">
  <AnimatePresence mode="wait" custom={direction} initial={false}>
    ...
  </AnimatePresence>
</div>
```

---

## Mobile Layout Improvements

### 4. Lesson page padding and card sizing

**File:** `components/lesson/SlideView.tsx`

The vA card uses `p-8` which is too much padding on small screens. Change to:
```tsx
className="max-w-[680px] mx-auto bg-white p-4 sm:p-8 rounded-[16px] shadow-lg border-0"
```

### 5. Navigation buttons — touch target size

**File:** `components/lesson/LessonPlayer.tsx`

Navigation prev/next buttons need minimum 44px touch targets on mobile. Find the nav button section and ensure:
```tsx
className="h-11 px-5 ..." // min 44px height
```

### 6. Quiz options — touch targets

**File:** `components/lesson/QuizQuestion.tsx`

Quiz option buttons should have minimum `py-4` (not `py-3`) on mobile for comfortable tapping:
```tsx
className="w-full text-left py-4 px-4 rounded-xl ..."
```

### 7. Progress bar — visible on mobile

**File:** `components/lesson/LessonPlayer.tsx`

Progress bar section has `mt-6` which may be cut off on small viewports. Ensure it's always visible by moving it above the slide content or making the lesson layout a flex column with fixed header/footer:

The lesson layout should be:
```
[Fixed top: progress bar + lesson title]
[Scrollable: slide content]  
[Fixed bottom: prev/next navigation]
```

This prevents the nav buttons from being below the fold on short mobile screens.

---

## Constraints
- Apply fixes to both vA and vB layouts where applicable
- No changes to API routes, DB schema, or seed files
- No changes to `lib/auth.ts` or `middleware.ts`
- TypeScript must compile clean
- Test mentally for 375px viewport width (iPhone SE)

## Verification
- Quiz: correct answer appears in different positions across questions (not always B)
- Slide navigation: page starts at top on every slide change
- Slide transition: smooth parallax-style animation on mobile, no horizontal overflow
- Nav buttons: easily tappable without zooming
- Quiz options: large enough tap targets
- No layout shift during slide transitions
