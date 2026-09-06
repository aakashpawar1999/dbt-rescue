import mr from './locales/mr.json'
import ta from './locales/ta.json'
import te from './locales/te.json'
import bn from './locales/bn.json'
import hinglish from './locales/hi-Latn.json'
import type { Language } from './languages'

export const TRANSLATIONS: Record<string, Record<string, string>> = { mr, ta, te, bn, 'hi-Latn': hinglish }
const hindiMenu: Record<string, string> = { 'Change language': 'भाषा बदलें', Language: 'भाषा', 'More options': 'और विकल्प', 'New example': 'नया उदाहरण', 'Standard text': 'सामान्य अक्षर', 'Larger text': 'बड़े अक्षर', 'iPhone frame': 'iPhone फ्रेम' }
export function translateText(value: string, language: Language) {
  return (language === 'hi' ? hindiMenu[value] : TRANSLATIONS[language]?.[value]) ?? value
}
export function translateCopy<T>(value: T, language: Language): T {
  if (typeof value === 'string') return translateText(value, language) as T
  if (Array.isArray(value)) return value.map((item) => translateCopy(item, language)) as T
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateCopy(item, language)])) as T
  return value
}
