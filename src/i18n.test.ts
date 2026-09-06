import { LANGUAGES } from './languages'
import { translateText } from './locales'
import { describe, expect, it } from 'vitest'
import { findPaymentCase } from './domain/cases'
import { diagnosePayment } from './domain/rules'
import { CASE_REFERENCES, DIAGNOSIS_COPY, EVENT_COPY, TEXT, getCaseCopy, getDiagnosisCopy, recoveryLabel, t, type TextKey } from './i18n'

function interpolationTokens(value: string) {
  return [...value.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]).sort()
}

describe('reviewed bilingual copy', () => {
  it('keeps the shared correction label scheme-neutral', () => {
    expect(recoveryLabel('en', 'record-updated')).toBe('Scheme record updated')
    expect(recoveryLabel('hi', 'record-updated')).toBe('योजना रिकॉर्ड अपडेट हुआ')
  })
  it.each(['en', 'hi'] as const)('localizes the selected fallback without restoring fixture success in %s', (language) => {
    const payment = structuredClone(findPaymentCase('DBT-SUNITA-001')!)
    payment.events = payment.events.filter((event) => event.id !== 'destination-credited')
    const diagnosis = diagnosePayment(payment)
    const copy = getDiagnosisCopy(diagnosis.provenance.ruleId, language)
    expect(copy).toBeDefined()
    expect(copy?.reason).not.toBe(DIAGNOSIS_COPY[payment.reference][language].reason)
    expect(copy?.reason).toBe(language === 'en' ? diagnosis.reason : 'इस भुगतान कारण के लिए कोई समीक्षा किया गया निर्देश उपलब्ध नहीं है')
  })

  it('returns stable event identities so presentation can join reordered observations', () => {
    const copy = getCaseCopy('DBT-SUNITA-001', 'hi')!
    expect(copy.events.map((event) => (event as { id?: string }).id)).toEqual(findPaymentCase('DBT-SUNITA-001')!.events.map((event) => event.id))
  })
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
      const diagnosis = getDiagnosisCopy(diagnosePayment(findPaymentCase(reference)!).provenance.ruleId, 'hi')

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
    expect(getDiagnosisCopy('DBT-MEENA-003-RULE-1', 'hi')?.reason).toBe('DBT के लिए कोई सक्रिय बैंक मैप नहीं है')
  })
})


describe('all supported demo languages', () => {
  it.each(LANGUAGES.map(({code}) => code))('preserves case and rule identity in %s', (language) => {
    for (const reference of CASE_REFERENCES) {
      const payment = findPaymentCase(reference)!
      const copy = getCaseCopy(reference, language)!
      const diagnosis = diagnosePayment(payment)
      expect(copy.events.map(({id}) => id)).toEqual(payment.events.map(({id}) => id))
      expect(copy.maskedAccount).toContain(getCaseCopy(reference, 'en')!.maskedAccount.slice(-4))
      expect(getDiagnosisCopy(diagnosis.provenance.ruleId, language)?.reason).toBe(language === 'hi' ? DIAGNOSIS_COPY[reference].hi.reason : translateText(diagnosis.reason, language))
    }
    expect(getDiagnosisCopy('UNKNOWN-RAW-REASON', language)?.reason).not.toBe(getDiagnosisCopy('DBT-SUNITA-001-RULE-1', language)?.reason)
    expect(getDiagnosisCopy('invalid-rule', language)).toBeUndefined()
    expect(t(language, 'technicalReason', {code: 'UID_NOT_MAPPED'})).toContain('UID_NOT_MAPPED')
  })
})
