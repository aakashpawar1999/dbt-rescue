import { describe, expect, it } from 'vitest'
import { findPaymentCase } from './cases'
import { diagnosePayment } from './rules'

describe('DBT-MEENA-003', () => {
  it('loads only the fictional pension payment from the safe reference', () => {
    const payment = findPaymentCase('DBT-MEENA-003')

    expect(payment).not.toBeNull()
    expect(payment?.reference).toBe('DBT-MEENA-003')
    expect(payment?.scheme).toBe('Social pension demo')
    expect(payment?.beneficiaryName).toBe('Meena Kumari')
    expect(payment?.route).toBe('aadhaar')
  })

  it('does not fabricate a result for an unknown reference', () => {
    expect(findPaymentCase('DBT-UNKNOWN-999')).toBeNull()
  })

  it('maps the reviewed failure to the bank and its exact next action', () => {
    const payment = findPaymentCase('DBT-MEENA-003')
    if (!payment) throw new Error('fixture missing')

    const diagnosis = diagnosePayment(payment)

    expect(diagnosis.owner).toBe('Your bank branch')
    expect(diagnosis.reason).toBe('No active bank is mapped for DBT')
    expect(diagnosis.action).toContain('seed Aadhaar')
    expect(diagnosis.documents).toEqual([
      'Permitted identity document',
      'Bank passbook or account proof',
      'Scheme or beneficiary reference',
    ])
  })
})
