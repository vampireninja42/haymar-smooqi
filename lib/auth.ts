import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { generateReferralCode } from './utils'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
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

        return { id: user.id, email: user.email, name: user.name ?? undefined }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // On sign in: attach user id to token
      if (user) {
        token.id = user.id
      }
      // For Google OAuth: ensure our DB user ID is in the token
      if (account?.provider === 'google' && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true },
        })
        if (dbUser) token.id = dbUser.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async signIn({ user, account }) {
      // For Google OAuth: ensure user exists in our DB with referralCode
      if (account?.provider === 'google' && user.email) {
        try {
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
        } catch (err) {
          console.error('[signIn] error:', err)
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/onboarding',
  },
}

export default NextAuth(authOptions)
