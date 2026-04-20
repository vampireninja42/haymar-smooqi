import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { DEFAULT_VOICE_KEY, resolveVoiceProfileId } from '@/lib/voiceMap'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: { text?: string; language?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const text = typeof body.text === 'string' ? body.text.trim() : ''
  const language = typeof body.language === 'string' && body.language ? body.language : 'en'

  if (!text) {
    return NextResponse.json({ error: 'Invalid text' }, { status: 400 })
  }
  if (text.length > 5000) {
    return NextResponse.json({ error: 'Text too long (max 5000 chars)' }, { status: 400 })
  }

  // Look up the user's preferred voice key (abstract). Never trust a voice
  // value from the request — the provider profile_id mapping is server-only.
  let voiceKey: string = DEFAULT_VOICE_KEY
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { preferredVoice: true },
      })
      if (user?.preferredVoice) voiceKey = user.preferredVoice
    }
  } catch (err) {
    // Don't let a settings lookup failure block audio — just use the default.
    console.error('TTS: failed to load user voice preference:', err)
  }

  const profileId = resolveVoiceProfileId(voiceKey)
  const voiceboxUrl = process.env.VOICEBOX_URL || 'http://localhost:17493'

  try {
    const response = await fetch(`${voiceboxUrl}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, profile_id: profileId, language }),
    })

    if (!response.ok) {
      throw new Error(`Voicebox error: ${response.status}`)
    }

    const contentType = response.headers.get('content-type') || 'audio/mpeg'
    const audioBuffer = await response.arrayBuffer()

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Voicebox TTS failed:', error)
    return NextResponse.json(
      { error: 'TTS unavailable — audio mode requires Voicebox running locally' },
      { status: 503 }
    )
  }
}
