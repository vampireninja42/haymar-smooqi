import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = [
  '/home', '/explore', '/learn', '/leaderboard', '/reports',
  '/word-games', '/achievements', '/profile', '/settings',
  '/invite', '/review', '/saved', '/support', '/topics', '/onboarding',
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/api/auth')) return NextResponse.next()

  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
