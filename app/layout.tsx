import type { Metadata } from 'next'
import { Inter, Nunito } from 'next/font/google'
import './globals.css'
import { getThemeCSSVars } from '@/lib/theme'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'Smooqi — Learn Anything, One Lesson at a Time',
  description: 'One lesson a day across 195+ topics. Build real knowledge, one bite at a time.',
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
    if (prefs?.backgroundPattern && prefs.backgroundPattern !== 'solid') {
      const patternMap: Record<string, { style: string; size: string }> = {
        dots: { style: 'radial-gradient(circle, rgba(124,58,237,0.15) 1px, transparent 1px)', size: '20px 20px' },
        grid: { style: 'linear-gradient(rgba(124,58,237,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.08) 1px, transparent 1px)', size: '40px 40px' },
        waves: { style: 'repeating-linear-gradient(45deg, rgba(124,58,237,0.05) 0px, rgba(124,58,237,0.05) 2px, transparent 2px, transparent 10px)', size: '14px 14px' },
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
    : '#FAFAF7'

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
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
  :root { ${themeVars} --bg-pattern: none; --bg-pattern-size: auto; ${bgPatternCSS} }
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
