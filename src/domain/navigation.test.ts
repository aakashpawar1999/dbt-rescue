import { describe, expect, it } from 'vitest'
import { readNavigation } from './navigation'

const snapshot = { version: 1, generation: 'current', reference: 'DBT-SUNITA-001', step: 2, recoveryState: 'needs-trace', expiresAt: 2000 }

describe('case navigation boundary', () => {
  it('restores a complete matching snapshot', () => {
    expect(readNavigation(snapshot, 'current', 1000)?.payment.reference).toBe('DBT-SUNITA-001')
  })
  it.each([
    null, {}, { ...snapshot, generation: 'cleared' }, { ...snapshot, version: 2 },
    { ...snapshot, reference: 'DBT-UNKNOWN' }, { ...snapshot, step: 1.5 },
    { ...snapshot, step: 7 }, { ...snapshot, expiresAt: 1000 },
    { ...snapshot, recoveryState: 'needs-correction' },
  ])('fails closed for incompatible, expired or cleared state: %j', (value) => {
    expect(readNavigation(value, 'current', 1000)).toBeNull()
  })
})
