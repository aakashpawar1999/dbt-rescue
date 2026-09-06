import packageJson from '../package.json'
import { describe, expect, it } from 'vitest'
import { PAYMENT_CASES } from './domain/cases'
import { diagnoseEvent } from './domain/rules'

const ALLOWED_SOURCE_HOSTS = ['dbtbharat.gov.in', 'pfms.nic.in', 'www.npci.org.in']

describe('1.1.0 release boundary', () => {
  it('covers every fixture event without inventing a reviewed remedy', () => {
    for (const payment of PAYMENT_CASES) {
      for (const event of payment.events) {
        const diagnosis = diagnoseEvent(payment, event)
        expect(diagnosis.provenance.matchedEventId).toBe(event.id)
        expect(diagnosis.provenance.rawReason).toBe(event.rawReason)
      }
    }
  })

  it('keeps runtime synthetic, masked, and source allowlisted', () => {
    expect(PAYMENT_CASES.every((payment) => payment.events.every((event) => event.simulated && event.maskedReference === payment.reference))).toBe(true)
    expect(PAYMENT_CASES.every((payment) => /•/.test(payment.maskedAccount))).toBe(true)
    for (const payment of PAYMENT_CASES) {
      for (const event of payment.events) {
        const sourceUrl = diagnoseEvent(payment, event).provenance.sourceUrl
        if (sourceUrl) expect(ALLOWED_SOURCE_HOSTS.some((host) => sourceUrl.includes(host))).toBe(true)
      }
    }
  })

  it('ships the planned package version', () => {
    expect(packageJson.version).toBe('1.1.0')
  })

})
