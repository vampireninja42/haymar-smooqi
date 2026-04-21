# Spec: Production Polish — Favicon, 404, Error Page, Support Email, Pricing Guard

## 1. Favicon — `app/favicon.ico` + `app/icon.tsx`

Create `app/icon.tsx` (Next.js app router icon) that renders a simple SVG favicon using the brand color:

```tsx
import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div style={{
      background: '#7C3AED',
      width: '100%',
      height: '100%',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: 20,
      fontWeight: 700,
    }}>
      S
    </div>
  )
}
```

Also add to `app/layout.tsx` metadata:
```ts
icons: { icon: '/icon' }
```

---

## 2. Custom 404 Page — `app/not-found.tsx`

Create a branded not-found page:
- Smooqi branding (use `themeConfig`, primary color)
- Message: "Page not found"
- Subtext: "This page doesn't exist or was moved."
- Button: "Go Home" → `/home` (or `/` if not logged in — just link to `/`)
- Match the app's visual style (card, centered, same font/color vars)

---

## 3. Custom Error Page — `app/error.tsx`

Create a client-side error boundary page (`'use client'`):
- Props: `{ error: Error, reset: () => void }`
- Message: "Something went wrong"
- Subtext: `error.message` (only in dev) or generic "Please try again" in prod
- Button: "Try Again" → calls `reset()`
- Button: "Go Home" → `/`
- Match brand style

---

## 4. Support Confirmation Email — `app/api/support/route.ts`

After the `prisma.supportRequest.create()` call, add a Resend confirmation email to the user:

```ts
import { Resend } from 'resend'
// ...
const resend = new Resend(process.env.RESEND_API_KEY)
await resend.emails.send({
  from: 'Smooqi Support <support@haymar.ai>',
  to: email,
  subject: `We received your message: ${subject}`,
  html: `
    <p>Hi,</p>
    <p>Thanks for reaching out. We received your support request and will get back to you within 24 hours.</p>
    <p><strong>Your message:</strong><br/>${description}</p>
    <p>— The Smooqi Team</p>
  `,
})
```

Wrap in try/catch — if email fails, still return success (don't block the user).

---

## 5. Pricing Page — Guard when Stripe not configured

In `app/(public)/pricing/PricingCards.tsx`, after the fetch to `/api/stripe/create-session`:
- If response status is `503`, show toast/inline message: `"Payments coming soon — check back shortly!"`
- Do NOT redirect to login on any error

In `app/(app)/settings/subscription/SubscriptionActions.tsx`, after fetch to `/api/stripe/portal`:
- If response status is `503`, show inline message: `"Payment portal coming soon."`
- Do NOT redirect to login on any error

---

## Constraints
- No changes to auth, middleware, DB schema, or seed
- TypeScript must compile clean
- All pages must match the existing visual style (use `var(--color-primary)`, existing card/button components)
