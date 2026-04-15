import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

// NextAuth v5 session cookie names
const SESSION_COOKIE_NAMES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Never block NextAuth callback paths
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  // Check for any session cookie — presence = authenticated
  const hasSession = SESSION_COOKIE_NAMES.some(name => req.cookies.has(name))

  if (!hasSession) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
