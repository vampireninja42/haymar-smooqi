export function updateSM2(
  review: { easeFactor: number; interval: number; repetitions: number },
  rating: 0 | 1 | 2
) {
  const q = rating === 2 ? 5 : rating === 1 ? 3 : 1
  let { easeFactor, interval, repetitions } = review

  if (q >= 3) {
    interval = repetitions === 0 ? 1 : repetitions === 1 ? 6 : Math.round(interval * easeFactor)
    repetitions += 1
  } else {
    repetitions = 0
    interval = 1
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const nextReviewAt = new Date()
  nextReviewAt.setDate(nextReviewAt.getDate() + interval)

  return { easeFactor, interval, repetitions, nextReviewAt }
}
