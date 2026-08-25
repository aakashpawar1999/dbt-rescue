import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App, { DiagnosisAudit } from './App'
import { findPaymentCase } from './domain/cases'
import { diagnosePayment } from './domain/rules'

describe('DBT Rescue safe entry point', () => {
  it('starts with the fictional reference and a clear prototype warning', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('Independent hackathon prototype')
    expect(html).toContain('value="DBT-SUNITA-001" selected')
    expect(html).not.toContain('value="DBT-MEENA-003" selected')
    expect(html).toContain('Choose a fictional payment')
    expect(html).toContain('DBT-SUNITA-001')
    expect(html).toContain('DBT-ARJUN-002')
    expect(html).toContain('Aadhaar-based')
    expect(html).toContain('Account-based')
    expect(html).toContain('Do not enter real Aadhaar')
    expect(html).not.toContain('Enter your Aadhaar')
    expect(html).toContain('English')
    expect(html).toContain('हिन्दी')
    expect(html).toContain('Use assisted mode')
    expect(html).toContain('src="/logo.png"')
    expect(html).toContain('alt="DBT Rescue logo"')
    expect(html).toContain('<footer class="site-footer"')
    expect(html).toContain('Build What Moves India hackathon project')
    expect(html).toContain('Not a government service')
    expect(html).toContain('aria-live="polite"')
  })

  it('exposes names and instructions for critical controls', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('role="group" aria-label="Language"')
    expect(html).toContain('aria-describedby="reference-help"')
    expect(html).toContain('What works and what is simulated')
    expect(html).toContain('href="https://github.com/aakashpawar1999/dbt-rescue/blob/main/docs/functional-vs-simulated.md"')
    expect(html).toContain('href="https://github.com/aakashpawar1999/dbt-rescue/blob/main/docs/known-limitations.md"')
    expect(html).toContain('role="status" aria-live="polite"')
  })

  it('shows exact rule provenance behind a diagnosis as progressive disclosure', () => {
    const payment = findPaymentCase('DBT-ARJUN-002')
    if (!payment) throw new Error('fixture missing')

    const html = renderToStaticMarkup(<DiagnosisAudit payment={payment} diagnosis={diagnosePayment(payment)} language="en" />)

    expect(html).toContain('How this diagnosis was decided')
    expect(html).toContain('destination-failed')
    expect(html).toContain('DBT-ARJUN-002-RULE-1')
    expect(html).toContain('PFMS validation and payment rejection remedies')
    expect(html).toContain('human-reviewed')
    expect(html).toContain('INVALID_IFSC')
  })
})
