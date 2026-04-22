# Spec: Remove Free Plan — Trial-Only Model

## Context
There is no permanent free plan. New users get a 7-day free trial, then must subscribe (monthly or annual). Remove all references to a free tier throughout the app and marketing.

---

## File 1 — `app/(public)/pricing/PricingCards.tsx`

Remove the `Free` plan entirely from the `plans` array. Keep only `Monthly` and `Annual`.

Update the page heading copy in `app/(public)/pricing/page.tsx`:
- Change: `"Start free. Upgrade when you're ready."`
- To: `"Try free for 7 days. No credit card required."`

Update both remaining plan descriptions:
- Monthly: `"7-day free trial, then $9.99/month"`
- Annual: `"7-day free trial, then $59.99/year"`

Update button labels:
- Both: `"Start 7-Day Free Trial"`

Update `Monthly` features — remove `"Everything in Free"`, replace with full feature list:
```
- All courses — beginner through advanced
- XP & leveling system
- Daily streaks & challenges
- Word games
- Community leaderboard
- Spaced repetition reviews
- Priority support
- Ad-free experience
```

Update `Annual` features:
```
- Everything in Monthly
- Save 50% vs. monthly
- Early access to new courses
- Exclusive achievements
- Premium support
```

---

## File 2 — `components/marketing/CtaSection.tsx`

Remove the `Free` plan card. Keep only `Monthly` and `Annual` cards.

Update section heading from `"Start Free. Go Premium When You're Ready."` to `"Try Smooqi Free for 7 Days"`.

Update both CTA buttons to `"Start 7-Day Free Trial"`.

Remove `"Always free"` and `"Everything in Free"` feature items.

---

## File 3 — `components/marketing/HeroSection.tsx`

Change CTA button text from `"Start Learning for Free"` to `"Start Your Free Trial"`. Keep the link to `/signup`.

---

## File 4 — `components/marketing/FaqSection.tsx`

Update the FAQ entry `"Is it really free?"`:
- Question: `"Do I need a credit card to start?"`
- Answer: `"No credit card required to start your 7-day free trial. You'll get full access to everything — all courses, audio mode, word games, achievements, and progress tracking. After your trial, choose a monthly or annual plan to continue."`

---

## File 5 — `components/marketing/vb/VbCta.tsx`

Change `"Free to start."` to `"7-day free trial."` and `"Start for Free"` button to `"Start Free Trial"`.

---

## File 6 — `app/(app)/settings/subscription/page.tsx`

The `status === 'free'` block shows `"Free Plan"` with an upgrade button. Update the copy:
- Badge label: `"Trial Expired"` (not "Free Plan")
- Description: `"Your free trial has ended. Subscribe to continue learning."`
- Keep the upgrade button as-is (links to `/pricing`)

---

## File 7 — Signup page — set trial on all new signups

**File:** `app/api/signup/route.ts`

Currently, users who sign up without a referral code get no trial (`subscriptionStatus` defaults to `'free'`). All new users should get a 7-day trial:

```ts
await prisma.user.create({
  data: {
    ...
    subscriptionStatus: 'trialing',
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    referralCode: generateReferralCode(),
    referredById,
    // Remove the conditional trial — always apply
  }
})
```

---

## Constraints
- No changes to DB schema or Stripe integration
- No changes to auth or middleware
- Keep the referral bonus trial logic intact (referral still gives +500 XP, new user already gets trial from Fix 7)
- TypeScript must compile clean

## Verification
- Pricing page shows 2 cards (Monthly + Annual), no Free card
- Both cards say "Start 7-Day Free Trial"
- Landing page CTA says "Start Your Free Trial"
- FAQ updated — no mention of permanent free plan
- New signup gets 7-day trial automatically
- User with expired trial sees "Trial Expired" in subscription settings
