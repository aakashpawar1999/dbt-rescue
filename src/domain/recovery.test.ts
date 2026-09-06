import { describe, expect, it } from 'vitest'
import { findPaymentCase } from './cases'
import { diagnosePayment } from './rules'
import { advanceRecovery, buildCorrectionRequest, getRecoveryStates, type RecoveryState } from './recovery'

describe('fictional recovery sequence', () => {
  it('rejects every recovery state from the other sequence', () => {
    for (const type of ['trace', 'correction'] as const) {
      const other = type === 'trace' ? 'correction' : 'trace'
      for (const state of getRecoveryStates(other)) {
        expect(() => advanceRecovery(state, type)).toThrow('Invalid recovery transition')
      }
    }
  })
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

  it('uses a trace sequence for Sunita without inventing a correction or credit', () => {
    const payment = findPaymentCase('DBT-SUNITA-001')
    if (!payment) throw new Error('fixture missing')

    const diagnosis = diagnosePayment(payment)
    const states = getRecoveryStates(diagnosis.recoveryType)

    expect(states).toEqual(['needs-trace', 'trace-requested', 'trace-confirmed'])
    expect(advanceRecovery(states[0], diagnosis.recoveryType)).toBe('trace-requested')
    expect(advanceRecovery(states[1], diagnosis.recoveryType)).toBe('trace-confirmed')
  })

  it.each(['DBT-SUNITA-001', 'DBT-ARJUN-002', 'DBT-MEENA-003'])('builds the right request type for %s', (reference) => {
    const payment = findPaymentCase(reference)
    if (!payment) throw new Error('fixture missing')

    const diagnosis = diagnosePayment(payment)
    const request = buildCorrectionRequest(payment, diagnosis)

    expect(request.requestType).toBe(diagnosis.recoveryType)
    expect(request.nextState).toBe(diagnosis.nextState)
    expect(request.reference).toBe(reference)
    expect(request.account).not.toMatch(/\d{6,}/)
  })
})
