import type { Metadata } from 'next'
import { Inter, Nunito } from 'next/font/google'
import './globals.css'
import { getThemeCSSVars } from '@/lib/theme'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'Smooqi — Learn Anything, One Lesson at a Time',
  description: 'One lesson a day across 195+ topics. Build real knowledge, one bite at a time.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const themeVars = getThemeCSSVars()
  const variant = process.env.NEXT_PUBLIC_THEME_VARIANT ?? 'vA'
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
  :root { ${themeVars} }
  body { background: ${bodyBg} !important; min-height: 100vh; }
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
