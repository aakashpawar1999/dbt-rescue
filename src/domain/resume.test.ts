import { describe, expect, it } from 'vitest'
import { readResume } from './resume'

const snapshot = { version: 1, generation: 'demo-generation', reference: 'DBT-ARJUN-002', step: 6, recoveryState: 'payment-reissued', language: 'hi', assisted: true, expiresAt: 2000 }

describe('device-local demo resume', () => {
  it('restores only validated fixture identity and progress', () => {
    const result = readResume(JSON.stringify({ ...snapshot, payment: { beneficiaryName: 'Injected name' } }), 1000)
    expect(result?.payment.beneficiaryName).toBe('Arjun Singh')
    expect(result?.language).toBe('hi')
    expect(result?.assisted).toBe(true)
    expect(result?.recoveryState).toBe('payment-reissued')
    expect(result?.expiresAt).toBe(2000)
  })
  it('normalizes legacy answer positions to the combined answer', () => {
    expect(readResume(JSON.stringify({ ...snapshot, step: 2 }), 1000)?.step).toBe(1)
    expect(readResume(JSON.stringify({ ...snapshot, step: 3 }), 1000)?.step).toBe(1)
  })
  it.each([null, '', '{', 'null', '[]', JSON.stringify({...snapshot, version: 99}),
    JSON.stringify({...snapshot, expiresAt: 1000}), JSON.stringify({...snapshot, language: 'unknown'}),
    JSON.stringify({...snapshot, assisted: 'true'}), JSON.stringify({...snapshot, generation: null}),
    JSON.stringify({...snapshot, recoveryState: 'account-credited'}), JSON.stringify({...snapshot, reference: 'DBT-MEENA-003', recoveryState: 'trace-confirmed'}),
  ])('fails closed for expired or invalid data: %j', (raw) => {
    expect(readResume(raw, 1000)).toBeNull()
  })
})
