'use client'
import { themeConfig } from '@/lib/theme'

export function SmooqiLogo({ size = 'default' }: { size?: 'default' | 'small' | 'large' }) {
  const iconGradient = themeConfig.isVA
    ? 'linear-gradient(135deg, #7C3AED, #6D28D9)'
    : 'linear-gradient(135deg, #F97316, #EA580C)'
  const wordmarkColor = themeConfig.isVA ? '#7C3AED' : '#F97316'

  const iconSize = size === 'small' ? 'h-7 w-7' : size === 'large' ? 'h-11 w-11' : 'h-9 w-9'
  const svgSize = size === 'small' ? 'h-4 w-4' : 'h-5 w-5'
  const textSize = size === 'small' ? 'text-lg' : size === 'large' ? 'text-2xl' : 'text-xl'

  return (
    <div className="flex items-center gap-2">
      <div className={`flex ${iconSize} items-center justify-center rounded-2xl`}
           style={{ background: iconGradient }}>
        <svg viewBox="0 0 24 24" fill="none" className={svgSize}>
          <path d="M9 21h6M12 3C8.686 3 6 5.686 6 9c0 2.21 1.045 4.173 2.672 5.414L9 17h6l.328-2.586C16.955 13.173 18 11.21 18 9c0-3.314-2.686-6-6-6z"
                stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M9 17h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <span className={`${textSize} font-bold`} style={{ color: wordmarkColor }}>Smooqi</span>
    </div>
  )
}
