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
    ? 'linear-gradient(135deg, #EEF2FF 0%, #F5F0FF 30%, #F0FDFA 70%, #FFF1F2 100%)'
    : '#FAFAF7'

  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
  :root { ${themeVars} }
  body { background: ${bodyBg} !important; min-height: 100vh; }
  .app-shell, .app-shell > *, main, main > * { background: transparent !important; }
` }} />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
