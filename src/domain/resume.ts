import { isLanguage } from '../languages'
import { readNavigation } from './navigation'

export const RESUME_KEY = 'dbt-rescue.demo.v1'
export const RESUME_LIFETIME = 24 * 60 * 60 * 1000

export function readResume(raw: string | null, now: number) {
  if (!raw || raw.length > 16000) return null
  try {
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object' || typeof data.generation !== 'string' || !data.generation ||
      !isLanguage(data.language) || typeof data.assisted !== 'boolean') return null
    const navigation = readNavigation(data, data.generation, now)
    if (!navigation || navigation.step === 0 || data.expiresAt > now + RESUME_LIFETIME) return null
    return { ...navigation, step: navigation.step < 4 ? 1 : navigation.step, generation: data.generation as string, expiresAt: data.expiresAt as number,
      language: data.language, assisted: data.assisted as boolean }
  } catch { return null }
}
