import { describe, expect, it } from 'vitest'
import source from './locales/source.json'
import { TRANSLATIONS, translateText } from './locales'
import { LANGUAGES, isLanguage } from './languages'

const protectedTokens = (value: string) => value.match(/\{\{\w+\}\}|DBT-[A-Z]+-\d+|ACK-DEMO-|••\d+|\b(?:PFMS|NPCI|IFSC|OTPs?|DBT)\b/g)?.map((token) => token === 'OTPs' ? 'OTP' : token).sort() ?? []
describe('complete multilingual demo catalogues', () => {
  it('offers all seven requested languages with valid identifiers', () => {
    expect(LANGUAGES.map((item) => item.code)).toEqual(['en', 'hi-Latn', 'hi', 'mr', 'ta', 'te', 'bn'])
    expect(isLanguage('unknown')).toBe(false)
  })
  it.each(Object.keys(TRANSLATIONS))('%s covers every source phrase and preserves protected values', (language) => {
    const catalogue = TRANSLATIONS[language]
    for (const key of source) {
      expect(catalogue[key], key).toBeTruthy()
      expect(protectedTokens(catalogue[key]), key).toEqual(protectedTokens(key))
      expect(translateText(key, language as typeof LANGUAGES[number]['code'])).toBe(catalogue[key])
    }
  })
})
