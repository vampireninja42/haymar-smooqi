import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { generateReferralCode } from './utils'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }).safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
        if (!user || !user.passwordHash) return null

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account) {
        console.log('[JWT]', {
          provider: account.provider,
          tokenEmail: token.email,
          profileEmail: (profile as { email?: string })?.email,
          hasUser: !!user,
          userId: user?.id,
        })
      }

      if (account?.provider === 'credentials' && user?.id) {
        // Credentials: user.id comes from our authorize() function — it's our real DB ID
        token.id = user.id
        return token
      }

      if (account?.provider === 'google') {
        // Google OAuth: look up our real DB user ID by email
        // Do NOT use user.id — it's a NextAuth-generated temporary ID, not our DB ID
        const email = (token.email ?? (profile as { email?: string })?.email) as string | undefined
        if (email) {
          const dbUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
          })
          if (dbUser) {
            token.id = dbUser.id
          }
        }
        return token
      }

      // Subsequent requests (no account) — token.id already set, just return
      return token
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
    async signIn({ user, account }) {
      try {
        if (account?.provider === 'google' && user.email) {
          const existing = await prisma.user.findUnique({ where: { email: user.email } })
          if (!existing) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                provider: 'google',
                referralCode: generateReferralCode(),
              },
            })
          }
        }
        return true
      } catch (error) {
        console.error('[Auth] signIn error:', error)
        return true
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})
