export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi-Latn', name: 'Hinglish' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'bn', name: 'বাংলা' },
] as const
export type Language = typeof LANGUAGES[number]['code']
export function isLanguage(value: unknown): value is Language { return LANGUAGES.some((item) => item.code === value) }
