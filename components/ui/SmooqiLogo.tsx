'use client'
import { themeConfig } from '@/lib/theme'

export function SmooqiLogo({ size = 'default' }: { size?: 'default' | 'small' | 'large' }) {
  const iconGradient = themeConfig.isVA
    ? 'linear-gradient(135deg, #7C3AED, #9333EA)'
    : 'linear-gradient(135deg, #F97316, #FB923C)'
  const wordmarkGradient = themeConfig.isVA
    ? 'linear-gradient(90deg, #7C3AED, #9333EA)'
    : 'linear-gradient(90deg, #F97316, #FB923C)'

  const iconSize = size === 'small' ? 'h-7 w-7' : size === 'large' ? 'h-11 w-11' : 'h-9 w-9'
  const textSize = size === 'small' ? 'text-lg' : size === 'large' ? 'text-2xl' : 'text-xl'

  return (
    <div className="flex items-center gap-2">
      <div className={`flex ${iconSize} items-center justify-center rounded-xl`}
           style={{ background: iconGradient }}>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
          <path d="M12 2C8.686 2 6 4.686 6 8c0 2.123 1.078 3.994 2.714 5.124L9 15h6l.286-1.876C16.922 11.994 18 10.123 18 8c0-3.314-2.686-6-6-6z" fill="white" fillOpacity="0.9"/>
          <path d="M9 17h6M10 19h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="19" cy="4" r="1" fill="white" fillOpacity="0.6"/>
          <circle cx="20" cy="7" r="0.75" fill="white" fillOpacity="0.4"/>
          <circle cx="17" cy="2.5" r="0.75" fill="white" fillOpacity="0.4"/>
        </svg>
      </div>
      <span className={`${textSize} font-bold tracking-tight`}>
        <span style={{ color: '#1a1a2e' }}>Sm</span>
        <span style={{ background: wordmarkGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ooqi</span>
      </span>
    </div>
  )
}
