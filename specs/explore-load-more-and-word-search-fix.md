# Spec: Explore Load More (append) + Word Search Distractors

---

## Fix 1 — Explore "Load More" should append, not navigate

### Problem
`LoadMoreButton` uses `router.push(href, { scroll: false })` which is still a full page navigation — replaces the page with only page 2 results instead of appending to the existing list.

### Solution
Convert the course grid section of the explore page to a client component that fetches and appends results without navigating.

**Step 1 — Create `/app/api/courses/route.ts`**

A GET endpoint that accepts the same search params as the explore page and returns courses as JSON:

```ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const ITEMS_PER_PAGE = 12

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id

  const { searchParams } = req.nextUrl
  const q = searchParams.get('q') ?? ''
  const topicFilter = searchParams.get('topic') ?? ''
  const levelFilter = searchParams.get('level') ?? ''
  const accessFilter = searchParams.get('access') ?? ''
  const sort = searchParams.get('sort') ?? 'popular'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))

  // Same where/orderBy logic as explore page
  // ... (replicate the existing where clause + orderBy from explore page)

  const skip = (page - 1) * ITEMS_PER_PAGE
  const [courses, total] = await Promise.all([
    prisma.course.findMany({ where, orderBy, skip, take: ITEMS_PER_PAGE, include: { topic: { select: { slug: true, name: true, icon: true } } } }),
    prisma.course.count({ where }),
  ])

  const savedCourses = await prisma.userSavedCourse.findMany({ where: { userId }, select: { courseId: true } })
  const savedIds = new Set(savedCourses.map(s => s.courseId))

  const progress = await prisma.userProgress.findMany({ where: { userId, courseCompleted: true, lessonId: null }, select: { courseId: true } })
  const completedIds = new Set(progress.map(p => p.courseId))

  return NextResponse.json({
    courses: courses.map(c => ({
      id: c.id, slug: c.slug, title: c.title, description: c.description,
      level: c.level, lessonCount: c.lessonCount, estimatedMinutes: c.estimatedMinutes,
      isFree: c.isFree, topic: c.topic,
      isSaved: savedIds.has(c.id),
      isCompleted: completedIds.has(c.id),
    })),
    hasMore: skip + courses.length < total,
    total,
  })
}
```

**Step 2 — Create `components/explore/CourseGrid.tsx` (client component)**

```tsx
'use client'
import { useState, useCallback } from 'react'
import { CourseCard } from '@/components/course/CourseCard'

// Takes initial server-rendered courses + hasMore flag + current filter params
// On Load More, fetches next page and appends to list
```

Props:
```ts
interface Props {
  initialCourses: CourseCardData[]
  initialHasMore: boolean
  filterParams: Record<string, string>  // current q, topic, level, access, sort
}
```

State: `courses` (starts with `initialCourses`), `hasMore`, `page` (starts at 1), `loading`.

On "Load More" click:
```ts
const res = await fetch(`/api/courses?${new URLSearchParams({ ...filterParams, page: String(page + 1) })}`)
const data = await res.json()
setCourses(prev => [...prev, ...data.courses])
setHasMore(data.hasMore)
setPage(p => p + 1)
```

Render the course grid + Load More button at the bottom. Loading state: show a spinner or "Loading..." text on the button.

**Step 3 — Update `app/(app)/explore/page.tsx`**

Replace the course grid + Load More section with `<CourseGrid>`. Pass the first page of courses and `hasMore` as props. Remove the `page` param from the URL-based filter logic (page is now managed client-side).

Keep all the filter UI (topic pills, search, sort) as server-rendered — only the course grid becomes client-side.

---

## Fix 2 — Word Search needs distractor words

### Problem
Every word shown in Word Search is a correct concept word — players can tap all of them and always be right. There's no challenge, no wrong answers, no real game.

### Solution: add distractor words to each round

**Step 1 — Update the seed data in `prisma/seed.ts`**

For each `wordSearchRounds` entry, add a `distractorWords` array alongside `conceptWords`. Distractors are plausible-sounding communication words that do NOT accurately describe the message:

Example round update:
```ts
{
  content: {
    message: "I want to make sure everyone on the team feels comfortable sharing their concerns before we finalize this decision.",
    conceptWords: ["psychological safety", "inclusion", "consensus"],  // reduce to 3 correct
    distractorWords: ["competition", "urgency", "efficiency"],         // 3 wrong
    explanation: "This message creates psychological safety by explicitly inviting dissent before a decision is finalized."
  }
}
```

Rules for updated rounds:
- 3 concept words (correct) per round
- 3 distractor words (wrong) per round  
- 6 total words shown, shuffled randomly
- Distractors are real communication concepts that just don't fit THIS particular message
- Re-write all 20 existing word search rounds with this new shape

**Step 2 — Update `components/word-games/WordSearch.tsx`**

Update the round type:
```ts
type WordSearchRound = {
  message: string
  conceptWords: string[]
  distractorWords: string[]
  explanation: string
}
```

Shuffle all 6 words together on render:
```ts
const allWords = useMemo(() => {
  const combined = [
    ...round.conceptWords.map(w => ({ word: w, isCorrect: true })),
    ...round.distractorWords.map(w => ({ word: w, isCorrect: false })),
  ]
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[combined[i], combined[j]] = [combined[j], combined[i]]
  }
  return combined
}, [round])
```

Update scoring: award point if user selected ALL concept words and NO distractors:
```ts
const handleSubmit = () => {
  const allConceptsSelected = round.conceptWords.every((_, i) =>
    selectedWords.has(allWords.findIndex(w => w.word === round.conceptWords[i]))
  )
  const noDistractorsSelected = allWords
    .filter((_, i) => selectedWords.has(i))
    .every(w => w.isCorrect)
  
  if (allConceptsSelected && noDistractorsSelected) {
    setScore(s => s + 1)
  }
  setPhase('feedback')
}
```

Update feedback styling:
- Selected + correct → green (`bg-green-100 border-green-400 text-green-800`)
- Selected + wrong → red (`bg-red-100 border-red-400 text-red-800`) 
- Not selected + correct (missed) → amber/yellow (`bg-yellow-50 border-yellow-300 text-yellow-800`)
- Not selected + wrong → faded gray (`bg-gray-50 border-gray-200 text-gray-400`)

**Step 3 — Update `app/(app)/word-games/[gameSlug]/page.tsx`**

Update the word-search mapping to pass `distractorWords`:
```ts
if (gameSlug === 'word-search') {
  const mapped = rounds.map(r => {
    const c = r.content as { message: string; conceptWords: string[]; distractorWords: string[]; explanation: string }
    return { message: c.message, conceptWords: c.conceptWords, distractorWords: c.distractorWords ?? [], explanation: c.explanation }
  })
  return <WordSearch rounds={mapped} />
}
```

---

## Constraints
- No changes to DB schema (distractors live in the `content` JSON field, no migration needed)
- No changes to auth, middleware, or other API routes
- Seed re-run required after this change to update word search rounds
- TypeScript must compile clean

## Verification
- Explore: Load More appends courses below existing ones, scroll position preserved
- Word Search: 6 words shown (3 correct, 3 wrong), shuffled each round
- Selecting a distractor and submitting = incorrect round
- Feedback shows green (correct selected), red (wrong selected), yellow (missed correct), gray (wrong not selected)
- Explanation shown after each round
- After seed re-run: 20 updated rounds in DB
