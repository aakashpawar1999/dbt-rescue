import { describe, expect, it } from 'vitest'
import { findPaymentCase } from './cases'
import { diagnosePayment } from './rules'
import { advanceRecovery, buildCorrectionRequest, type RecoveryState } from './recovery'

describe('fictional recovery sequence', () => {
  it('advances only through correction, reissue, and credit', () => {
    const states: RecoveryState[] = ['needs-correction']
    let state = states[0]

    while (state !== 'account-credited') {
      state = advanceRecovery(state)
      states.push(state)
    }

    expect(states).toEqual([
      'needs-correction',
      'correction-submitted',
      'record-updated',
      'payment-reissued',
      'account-credited',
    ])
  })

  it('builds a printable request with synthetic and masked values only', () => {
    const payment = findPaymentCase('DBT-MEENA-003')
    if (!payment) throw new Error('fixture missing')

    const request = buildCorrectionRequest(payment, diagnosePayment(payment))

    expect(request.reference).toBe('DBT-MEENA-003')
    expect(request.account).toContain('••42')
    expect(request.account).not.toMatch(/\d{6,}/)
    expect(request.owner).toBe('Your bank branch')
    expect(request.documents).toHaveLength(3)
  })
})
