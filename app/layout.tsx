import type { Metadata, Viewport } from 'next'
import { Inter, Nunito, Playfair_Display } from 'next/font/google'
import './globals.css'
import { getThemeCSSVars } from '@/lib/theme'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { validateEnv } from '@/lib/env'

validateEnv()

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Smooqi — Learn Anything, One Lesson at a Time',
  description: 'One lesson a day across 195+ topics. Build real knowledge, one bite at a time.',
  icons: { icon: '/icon' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const THEME_COLOR_MAP: Record<string, { primary: string; light: string }> = {
  purple: { primary: '#7C3AED', light: '#EDE9FE' },
  blue: { primary: '#2563EB', light: '#EFF6FF' },
  green: { primary: '#059669', light: '#F0FDF4' },
  orange: { primary: '#F97316', light: '#FFF7ED' },
  pink: { primary: '#EC4899', light: '#FDF2F8' },
  teal: { primary: '#0D9488', light: '#F0FDFA' },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let themeVars = getThemeCSSVars()
  const variant = process.env.NEXT_PUBLIC_THEME_VARIANT ?? 'vA'

  // Apply user theme if logged in
  const session = await getServerSession(authOptions)
  let bgPatternCSS = ''
  if (session?.user?.id) {
    const prefs = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { themeColor: true, backgroundPattern: true },
    })
    if (prefs?.themeColor && THEME_COLOR_MAP[prefs.themeColor]) {
      const tc = THEME_COLOR_MAP[prefs.themeColor]
      themeVars = themeVars
        .replace(/#7C3AED/g, tc.primary)
        .replace(/#EDE9FE/g, tc.light)
    }
    // Decorative background patterns are vA-only
    if (variant === 'vA' && prefs?.backgroundPattern && prefs.backgroundPattern !== 'solid') {
      const patternMap: Record<string, { style: string; size: string }> = {
        dots: { style: 'radial-gradient(circle, rgba(124,58,237,0.35) 1.5px, transparent 1.5px)', size: '24px 24px' },
        grid: { style: 'linear-gradient(rgba(124,58,237,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.10) 1px, transparent 1px)', size: '40px 40px' },
        diagonals: { style: 'repeating-linear-gradient(45deg, rgba(124,58,237,0.08) 0px, rgba(124,58,237,0.08) 2px, transparent 2px, transparent 12px)', size: '14px 14px' },
        waves: { style: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='20'%3E%3Cpath d='M0 10 Q25 0 50 10 Q75 20 100 10' fill='none' stroke='rgba(124%2C58%2C237%2C0.25)' stroke-width='1.5'/%3E%3C/svg%3E\")", size: '100px 20px' },
      }
      const pm = patternMap[prefs.backgroundPattern]
      if (pm) {
        bgPatternCSS = `--bg-pattern: ${pm.style}; --bg-pattern-size: ${pm.size};`
      }
    }
  }
  const bodyBg = variant === 'vA'
    ? `radial-gradient(ellipse at 20% 20%, rgba(167, 139, 250, 0.35) 0%, transparent 50%),
       radial-gradient(ellipse at 80% 10%, rgba(196, 181, 253, 0.25) 0%, transparent 40%),
       radial-gradient(ellipse at 60% 80%, rgba(110, 231, 183, 0.2) 0%, transparent 45%),
       radial-gradient(ellipse at 10% 70%, rgba(251, 207, 232, 0.25) 0%, transparent 40%),
       radial-gradient(ellipse at 90% 60%, rgba(147, 197, 253, 0.2) 0%, transparent 40%),
       #F1F0F7`
    : '#FAFAF6'

  const glassCardCSS = variant === 'vA' ? `
  .glass-card {
    background: rgba(255, 255, 255, 0.82) !important;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.6) !important;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04) !important;
  }` : ''

  const dotsCSS = variant === 'vA' ? `
  .bg-dots span {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }` : ''

  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable} ${playfair.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { var t = localStorage.getItem('smooqi-theme'); if (t === 'dark' || ((!t || t === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) { document.documentElement.classList.add('dark'); } } catch(e) {}`,
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: `
  :root { ${themeVars} --bg-pattern: none; --bg-pattern-size: auto; --font-playfair: 'Playfair Display', Georgia, serif; ${bgPatternCSS} }
  body { background: ${bodyBg} !important; min-height: 100vh; position: relative; }
  body::after { content: ''; position: fixed; inset: 0; background-image: var(--bg-pattern); background-size: var(--bg-pattern-size); pointer-events: none; z-index: 0; }
  .app-shell { background: transparent !important; }
  .app-shell > main { background: transparent !important; }
  .app-shell > main > div { background: transparent !important; }
  ${glassCardCSS}
  ${dotsCSS}
` }} />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
