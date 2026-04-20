/**
 * Maps abstract frontend voice keys ("voice_1", "voice_2", ...) to the TTS
 * provider's real profile_id. This is the ONLY place that knows about
 * provider-specific identifiers — the rest of the app (DB, API, UI) only
 * ever sees the abstract keys. Swap providers by editing this file.
 *
 * Voicebox profile_ids can be discovered via its GET /profiles endpoint.
 */
export const VOICE_MAP: Record<string, string> = {
  voice_1: 'b9de9585-3f4b-4e1e-be48-0145d8ff1398', // Heart
  voice_2: '97e3c554-b648-4f6a-aef7-7690a3dd4bf2', // George
}

/**
 * Public, provider-agnostic labels shown in the UI. Never surface Voicebox
 * voice names — the labels stay stable across provider changes.
 */
export const VOICE_LABELS: Record<string, string> = {
  voice_1: 'Voice 1',
  voice_2: 'Voice 2',
}

export const DEFAULT_VOICE_KEY = 'voice_1'

export const VOICE_KEYS = Object.keys(VOICE_LABELS)

export function isVoiceKey(value: unknown): value is keyof typeof VOICE_LABELS {
  return typeof value === 'string' && value in VOICE_LABELS
}

/**
 * Resolve an abstract voice key to the provider profile_id. Falls back to the
 * default voice silently if the key is unknown or its profile_id is missing —
 * never throws, so TTS degradation is graceful.
 */
export function resolveVoiceProfileId(voiceKey: string | null | undefined): string {
  const key = voiceKey && voiceKey in VOICE_MAP ? voiceKey : DEFAULT_VOICE_KEY
  return VOICE_MAP[key] ?? VOICE_MAP[DEFAULT_VOICE_KEY]
}
