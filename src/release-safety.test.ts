// @ts-expect-error Vitest runs this host-only test under Node; the app build has no Node types.
import { readFileSync } from 'node:fs'
import packageJson from '../package.json'
import { describe, expect, it } from 'vitest'
import { PAYMENT_CASES } from './domain/cases'
import { diagnoseEvent } from './domain/rules'

const ALLOWED_SOURCE_HOSTS = ['dbtbharat.gov.in', 'pfms.nic.in', 'www.npci.org.in']

describe('0.5.0 release boundary', () => {
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
    expect(packageJson.version).toBe('0.5.0')
  })

  it('pins every Pages action to a full commit SHA', () => {
    const workflow = readFileSync(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8')
    const actions = [...workflow.matchAll(/uses:\s*([^@\s]+)@([^\s]+)/g)].map((match) => `${match[1]}@${match[2]}`)
    expect(actions).toEqual([
      'actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803',
      'oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6',
      'actions/configure-pages@983d7736d9b0ae728b81ab479565c72886d7745b',
      'actions/upload-pages-artifact@7b1f4a764d45c48632c6b24a0339c27f5614fb0b',
      'actions/deploy-pages@d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e',
    ])
    expect(actions.every((action) => /^[^@]+@[0-9a-f]{40}$/.test(action))).toBe(true)
  })
})
