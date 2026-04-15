import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const protectedPaths = [
  '/home',
  '/explore',
  '/learn',
  '/leaderboard',
  '/reports',
  '/word-games',
  '/achievements',
  '/profile',
  '/settings',
  '/invite',
  '/review',
  '/saved',
  '/support',
  '/topics',
  '/onboarding',
]

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Never intercept auth callbacks — session cookie isn't set yet
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  if (isProtected && !req.auth) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
