import { describe, expect, it } from 'vitest'
import { CASE_REFERENCES, DIAGNOSIS_COPY, EVENT_COPY, TEXT, getCaseCopy, getDiagnosisCopy, t, type TextKey } from './i18n'

function interpolationTokens(value: string) {
  return [...value.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]).sort()
}

describe('reviewed bilingual copy', () => {
  it('keeps English and Hindi translation keys and interpolation tokens in parity', () => {
    expect(Object.keys(TEXT.en).sort()).toEqual(Object.keys(TEXT.hi).sort())

    for (const key of Object.keys(TEXT.en) as TextKey[]) {
      expect(interpolationTokens(TEXT.hi[key])).toEqual(interpolationTokens(TEXT.en[key]))
      expect(TEXT.en[key]).toBeTruthy()
      expect(TEXT.hi[key]).toBeTruthy()
    }
  })

  it('has reviewed copy for every supported case, event, diagnosis, and document', () => {
    for (const reference of CASE_REFERENCES) {
      const copy = getCaseCopy(reference, 'hi')
      const diagnosis = getDiagnosisCopy(reference, 'hi')

      expect(copy).toBeDefined()
      expect(diagnosis).toBeDefined()
      expect(copy?.events.length).toBeGreaterThan(0)
      expect(diagnosis?.documents.length).toBeGreaterThan(0)
      expect(copy?.events.every((event) => event.stage && event.detail && event.source)).toBe(true)
    }

    expect(Object.keys(EVENT_COPY)).toHaveLength(15)
    expect(Object.keys(DIAGNOSIS_COPY)).toEqual(CASE_REFERENCES)
  })

  it('keeps raw technical codes unchanged while translating surrounding copy', () => {
    expect(t('hi', 'technicalReason', { code: 'UID_NOT_MAPPED' })).toContain('UID_NOT_MAPPED')
    expect(getDiagnosisCopy('DBT-MEENA-003', 'hi')?.reason).toBe('DBT के लिए कोई सक्रिय बैंक मैप नहीं है')
  })
})
