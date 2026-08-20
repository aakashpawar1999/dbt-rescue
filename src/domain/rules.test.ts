import { describe, expect, it } from 'vitest'
import { findPaymentCase, latestConfirmedEvent } from './cases'
import { diagnosePayment } from './rules'

describe('fictional DBT fixtures', () => {
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
})
