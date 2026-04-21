# Spec: Course Completion Celebration + Courses Completed Count

---

## 1. Course Complete Celebration Screen

### Where it triggers
In `components/lesson/LessonPlayer.tsx`, when `state.phase === 'complete'` AND the lesson is the last lesson in the course AND the quiz was passed — the `course_complete` API call fires. After that fires successfully, show a **CourseComplete** screen instead of immediately redirecting to the course overview.

Currently the flow after quiz: `handleQuizAnswer` → if last lesson → posts `course_complete` → `handleBackToCourse()`. The celebration should appear **between** the quiz summary and the redirect.

### Implementation

**New component: `components/lesson/CourseComplete.tsx`**

Props:
```ts
interface Props {
  courseName: string
  lessonCount: number
  xpEarned: number       // pass 50 as the course_complete bonus XP
  onContinue: () => void // calls handleBackToCourse
}
```

**UI (vA):**
- Full-screen centered layout
- Large trophy emoji 🏆 with spring scale-in animation
- "Course Complete!" heading
- Course name subtitle
- XP badge: `+50 XP`  
- Stat row: "X lessons completed"
- Confetti burst on mount (same as LessonComplete)
- CTA button: "Back to Courses" → calls `onContinue`

**UI (vB):**
- Same quiet elegant style as vB LessonComplete
- Green checkmark circle with pulse rings
- "Course complete." heading (Playfair)
- Course name in muted text
- "+50 XP" in muted small text
- "Back to courses" button

### When to show it
In `LessonPlayer.tsx`, add a new phase state: `'courseComplete'`. After `course_complete` API fires successfully, set `state.phase = 'courseComplete'` instead of calling `handleBackToCourse()` immediately.

Render `<CourseComplete>` when `state.phase === 'courseComplete'`.

### XP bonus
When `course_complete` fires, also POST to `/api/xp` with `{ amount: 50, source: 'course_complete', sourceId: lesson.courseId }`. This is the course completion bonus on top of lesson/quiz XP.

---

## 2. Courses Completed — Profile Page

**File:** `app/(app)/profile/page.tsx`

Add a query for courses completed count alongside the existing queries:
```ts
prisma.userProgress.count({
  where: { userId, courseCompleted: true, lessonId: null }
})
```

Add to `statItems` array:
```ts
{ label: 'Courses', value: coursesCompleted }
```

Place it as the second stat (after Lessons, before Minutes) so the order is:
**Lessons | Courses | Minutes | Best Streak**

---

## 3. Courses Completed — Home Dashboard

**File:** `app/(app)/home/page.tsx`

Find the stats/progress section on the home page. Add courses completed count to the stats row shown there. Query it the same way as profile:
```ts
prisma.userProgress.count({
  where: { userId, courseCompleted: true, lessonId: null }
})
```

If there's a stats row component or inline stat cards, add "Courses Done" with the count. If the home page has no stat row currently, add a small inline stat under the XP/level section: `🏆 X courses completed`.

---

## Constraints
- No changes to DB schema, API routes, auth, or middleware
- No changes to seed files
- `CourseComplete` component must handle both vA and vB themes
- TypeScript must compile clean
- The celebration should only show when the course is genuinely completed (last lesson + quiz passed), not on every lesson

## Verification
- Complete the last lesson + quiz of a course → CourseComplete screen appears with confetti
- "Back to Courses" button navigates back to course overview
- Profile page stat row shows Courses count
- Home page shows courses completed count
- No TypeScript errors
