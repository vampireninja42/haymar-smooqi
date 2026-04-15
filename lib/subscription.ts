export function isPremium(user: { subscriptionStatus: string }): boolean {
  return ['trialing', 'active'].includes(user.subscriptionStatus)
}

export function canAccessCourse(
  course: { level: string; isFree: boolean },
  user: { subscriptionStatus: string }
): boolean {
  if (course.isFree) return true
  if (course.level === 'beginner') return true
  return isPremium(user)
}
