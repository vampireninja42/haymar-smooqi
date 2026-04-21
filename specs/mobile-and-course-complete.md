# Spec: Mobile Optimization + Course Completion Celebration + Courses Completed Count

---

## Part 1 — Quiz correct answer always in position B

**Root cause:** Options render in fixed A/B/C/D order. Content was authored with `correctAnswer: "B"` for most questions.

**Fix — shuffle options at render time in `components/lesson/QuizQuestion.tsx`:**

```ts
const shuffled = useMemo(() => {
  const entries = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD },
  ]
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[entries[i], entries[j]] = [entries[j], entries[i]]
  }
  const correctText = question[`option${question.correctAnswer}` as keyof typeof question]
  const newCorrectKey = OPTION_KEYS[entries.findIndex(e => e.text === correctText)]
  return { entries, correctKey: newCorrectKey }
}, [question])
```

Use `shuffled.entries` for rendering and `shuffled.correctKey` for comparison. Apply to both vA and vB layouts.

---

## Part 2 — Page scrolls to bottom on lesson load

**Fix in `components/lesson/LessonPlayer.tsx`:**

```ts
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'instant' })
}, [state.currentSlide, state.phase])
```

---

## Part 3 — Slide animation rigid on mobile

**Fix in `components/lesson/LessonPlayer.tsx`:**

Change `AnimatePresence` from `mode="popLayout"` to `mode="wait"`.

Update variants:
```ts
const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? '-30%' : '30%', opacity: 0 }),
}
```

Update transition:
```ts
transition={{
  x: { type: 'spring', stiffness: 220, damping: 28, mass: 0.6 },
  opacity: { duration: 0.15, ease: 'easeOut' },
}}
```

Wrap `AnimatePresence` in `overflow-hidden` to prevent horizontal scroll:
```tsx
<div className="relative overflow-hidden">
  <AnimatePresence mode="wait" custom={direction} initial={false}>
    ...
  </AnimatePresence>
</div>
```

---

## Part 4 — Mobile layout improvements

### Slide card padding (`components/lesson/SlideView.tsx`)
Change vA card from `p-8` to `p-4 sm:p-8`.

### Touch targets — nav buttons (`components/lesson/LessonPlayer.tsx`)
Nav prev/next buttons must be min 44px height: `h-11` minimum.

### Touch targets — quiz options (`components/lesson/QuizQuestion.tsx`)
Quiz option buttons: change to `py-4` minimum for comfortable mobile tapping.

### Fixed lesson layout
The lesson layout should be structured as:
- Fixed top: progress bar + lesson title
- Scrollable middle: slide content
- Fixed bottom: prev/next navigation

This prevents nav buttons from falling below the fold on short mobile screens.

---

## Part 5 — Course Completion Celebration Screen

### New component: `components/lesson/CourseComplete.tsx`

Props:
```ts
interface Props {
  courseName: string
  lessonCount: number
  xpEarned: number       // 50 XP bonus
  onContinue: () => void
}
```

**vA UI:**
- Full-screen centered layout
- 🏆 trophy emoji with spring scale-in animation + confetti burst on mount
- "Course Complete!" heading
- Course name subtitle
- XP badge: `+50 XP`
- Stat: "X lessons completed"
- CTA: "Back to Courses" → `onContinue`

**vB UI:**
- Quiet elegant style matching vB LessonComplete
- Green checkmark circle with pulse rings (reuse existing vB animation CSS)
- "Course complete." heading (Playfair font)
- Course name in muted text
- "+50 XP" in muted small text
- "Back to courses" button

### Wire into `LessonPlayer.tsx`

Add `'courseComplete'` to the phase state type.

After `course_complete` API fires successfully (in the `useEffect` that fires on `phase === 'complete'`), also POST to `/api/xp` with `{ amount: 50, source: 'course_complete', sourceId: lesson.courseId }`, then set phase to `'courseComplete'` instead of calling `handleBackToCourse()`.

Render `<CourseComplete>` when `state.phase === 'courseComplete'`. `onContinue` calls `handleBackToCourse()`.

The `courseComplete` phase should only trigger when the current lesson is the last lesson in the course (check `lesson.course.lessons` array — last by `sortOrder`).

---

## Part 6 — Courses Completed count on Profile

**File:** `app/(app)/profile/page.tsx`

Add query:
```ts
prisma.userProgress.count({
  where: { userId, courseCompleted: true, lessonId: null }
})
```

Add to `statItems` as second item (after Lessons, before Minutes):
```ts
{ label: 'Courses', value: coursesCompleted }
```

Final order: **Lessons | Courses | Minutes | Best Streak**

---

## Part 7 — Courses Completed count on Home Dashboard

**File:** `app/(app)/home/page.tsx`

Add the same count query. Display in the stats/progress section as `🏆 X courses completed`. If no stat row exists, add a small inline stat under the XP/level display.

---

## Constraints
- No changes to DB schema, API routes, auth, middleware, or seed files
- `CourseComplete` must handle both vA and vB themes
- Course celebration only triggers on last lesson + quiz passed — not every lesson
- TypeScript must compile clean
- All mobile fixes apply to 375px viewport width minimum (iPhone SE)

## Verification
- Quiz options appear in different positions across questions (not always B)
- Every slide change scrolls to top
- Slide transitions feel smooth on mobile — no horizontal overflow
- Nav buttons are easily tappable without zooming
- Complete last lesson + quiz of a course → CourseComplete screen with confetti
- "Back to Courses" works
- Profile page shows Courses count in stat row
- Home dashboard shows courses completed count
- No TypeScript errors
