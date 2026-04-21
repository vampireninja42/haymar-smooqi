import { prisma } from "@/lib/db"
import { resetRateLimit } from "@/lib/rateLimit"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const { success } = await resetRateLimit.limit(`reset-use:${ip}`)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      )
    }

    const { token, password } = parsed.data

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })
      return NextResponse.json(
        { error: "Reset token has expired. Please request a new one." },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    })

    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
