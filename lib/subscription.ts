export function isPremium(user: { subscriptionStatus: string; trialEndsAt?: Date | null }): boolean {
  if (user.subscriptionStatus === 'active') return true
  if (user.subscriptionStatus === 'trialing') {
    if (!user.trialEndsAt) return true
    return new Date() < new Date(user.trialEndsAt)
  }
  return false
}

export function canAccessCourse(
  course: { level: string; isFree: boolean },
  user: { subscriptionStatus: string; trialEndsAt?: Date | null }
): boolean {
  if (course.isFree) return true
  return isPremium(user)
}
