import { describe, expect, it } from 'vitest'
import { findPaymentCase, latestConfirmedEvent, PAYMENT_CASES } from './cases'
import { diagnoseEvent, diagnosePayment } from './rules'

describe('fictional DBT fixtures', () => {
  it.each(['missing', 'conflict', 'failed', 'wrong-route', 'wrong-reference', 'absent'])('does not infer credit from %s destination evidence', (condition) => {
    const original = findPaymentCase('DBT-SUNITA-001')!
    const payment = structuredClone(original)
    const credit = payment.events.find((event) => event.id === 'destination-credited')!
    if (condition === 'absent') payment.events = payment.events.filter((event) => event !== credit)
    else if (condition === 'wrong-route') credit.route = 'account'
    else if (condition === 'wrong-reference') credit.maskedReference = 'DBT-ARJUN-002'
    else credit.status = condition as 'missing' | 'conflict' | 'failed'
    expect(diagnosePayment(payment).provenance.ruleId).toBe('UNKNOWN-RAW-REASON')
  })

  it('requires the selected observation to have the reviewed status and route', () => {
    const payment = findPaymentCase('DBT-MEENA-003')!
    const event = payment.events.find((item) => item.id === 'mapper-failed')!
    expect(diagnoseEvent(payment, { ...event, status: 'missing' }).provenance.reviewerStatus).toBe('unreviewed')
    expect(diagnoseEvent(payment, { ...event, route: 'account' }).provenance.reviewerStatus).toBe('unreviewed')
  })

  it.each([
    ['DBT-SUNITA-001', 'Farmer benefit demo', 'aadhaar'],
    ['DBT-ARJUN-002', 'Scholarship demo', 'account'],
    ['DBT-MEENA-003', 'Social pension demo', 'aadhaar'],
  ])('loads %s with its reviewed route', (reference, scheme, route) => {
    const payment = findPaymentCase(reference)

    expect(payment).not.toBeNull()
    expect(payment?.scheme).toBe(scheme)
    expect(payment?.route).toBe(route)
    expect(payment?.events.every((event) => event.simulated && event.maskedReference === reference)).toBe(true)
  })

  it.each(['', 'not-a-reference', 'DBT-UNKNOWN-999'])('does not fabricate a result for %s', (reference) => {
    expect(findPaymentCase(reference)).toBeNull()
  })

  it('keeps missing and conflicting source events visible', () => {
    const sunita = findPaymentCase('DBT-SUNITA-001')
    const meena = findPaymentCase('DBT-MEENA-003')

    expect(sunita?.events.some((event) => event.status === 'conflict')).toBe(true)
    expect(meena?.events.some((event) => event.status === 'missing')).toBe(true)
  })

  it.each([
    ['DBT-SUNITA-001', 'Bank B trace desk', 'Check Bank B before filing a grievance.', 'trace'],
    ['DBT-ARJUN-002', 'Scholarship department', 'Update the scheme beneficiary record with the current IFSC.', 'correction'],
    ['DBT-MEENA-003', 'Your bank branch', 'Ask your bank to seed Aadhaar', 'correction'],
  ])('selects the reviewed diagnosis for %s', (reference, owner, action, recoveryType) => {
    const payment = findPaymentCase(reference)
    if (!payment) throw new Error('fixture missing')

    const diagnosis = diagnosePayment(payment)

    expect(diagnosis.owner).toBe(owner)
    expect(diagnosis.action).toContain(action)
    expect(diagnosis.recoveryType).toBe(recoveryType)
    expect(diagnosis.sourceLabel).toContain('DBT')
    expect(diagnosis.reviewDate).toMatch(/^2026-/)
  })

  it('does not infer credit from a missing destination-bank response', () => {
    const payment = findPaymentCase('DBT-MEENA-003')
    if (!payment) throw new Error('fixture missing')

    expect(latestConfirmedEvent(payment)?.id).toBe('mapper-failed')
  })

  it.each([
    ['DBT-SUNITA-001', 'mapper-routed', 'MAPPED_TO_BANK_B', 'DBT-SUNITA-001-RULE-1'],
    ['DBT-ARJUN-002', 'destination-failed', 'INVALID_IFSC', 'DBT-ARJUN-002-RULE-1'],
    ['DBT-MEENA-003', 'mapper-failed', 'UID_NOT_MAPPED', 'DBT-MEENA-003-RULE-1'],
  ])('records exact provenance for %s', (reference, eventId, rawReason, ruleId) => {
    const payment = findPaymentCase(reference)
    if (!payment) throw new Error('fixture missing')

    const diagnosis = diagnosePayment(payment)

    expect(diagnosis.provenance.matchedEventId).toBe(eventId)
    expect(diagnosis.provenance.rawReason).toBe(rawReason)
    expect(diagnosis.provenance.ruleId).toBe(ruleId)
    expect(diagnosis.provenance.reviewerStatus).toBe('human-reviewed')
    expect(diagnosis.provenance.sourceUrl).toMatch(/^https:\/\//)
  })

  it('uses a safe fallback when a raw reason has no reviewed rule', () => {
    const payment = findPaymentCase('DBT-MEENA-003')
    if (!payment) throw new Error('fixture missing')
    const event = { ...payment.events[3], rawReason: 'UNREVIEWED_REASON' }

    const diagnosis = diagnoseEvent(payment, event)

    expect(diagnosis.provenance.reviewerStatus).toBe('unreviewed')
    expect(diagnosis.provenance.ruleId).toBe('UNKNOWN-RAW-REASON')
    expect(diagnosis.action).toContain('Do not use a specific remedy')
  })

  it('resolves every shipped event to a reviewed rule or the safe fallback', () => {
    for (const payment of PAYMENT_CASES) {
      for (const event of payment.events) {
        const diagnosis = diagnoseEvent(payment, event)
        expect(['human-reviewed', 'unreviewed']).toContain(diagnosis.provenance.reviewerStatus)
        if (diagnosis.provenance.reviewerStatus === 'unreviewed') {
          expect(diagnosis.action).toContain('Do not use a specific remedy')
        }
      }
    }
  })
})
