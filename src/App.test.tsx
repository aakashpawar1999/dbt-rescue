// @ts-expect-error Vitest runs this host-only test under Node; the app build has no Node types.
import { readFileSync } from 'node:fs'
// @ts-expect-error Vitest runs this host-only test under Node; the app build has no Node types.
import { resolve } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App, { DiagnosisAudit } from './App'
import { findPaymentCase } from './domain/cases'
import { diagnosePayment } from './domain/rules'

const styles = readFileSync(resolve('src/styles.css'), 'utf8')

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

  it('keeps the language toggle as the rightmost desktop header control', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toMatch(/<div class="mobile-language">.*<div class="topbar-actions">.*Start over<\/button><\/div><div class="desktop-language">/)
    expect(styles).toMatch(/\.mobile-language\s*{[^}]*display:\s*none;/s)
  })

  it('keeps the language box beside a compact mobile brand on narrow phones', () => {
    const mobileStart = styles.indexOf('@media (max-width: 767px)')
    const narrowStart = styles.indexOf('@media (max-width: 439px)')
    const mobileStyles = styles.slice(mobileStart, narrowStart)
    const narrowStyles = styles.slice(narrowStart)

    expect(mobileStart).toBeGreaterThan(-1)
    expect(mobileStyles).toMatch(/\.topbar\s*{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*minmax\(0, 1fr\) auto;/s)
    expect(mobileStyles).toMatch(/\.mobile-language\s*{[^}]*display:\s*block;[^}]*grid-column:\s*2;[^}]*grid-row:\s*1;[^}]*justify-self:\s*end;/s)
    expect(mobileStyles).toMatch(/\.desktop-language\s*{[^}]*display:\s*none;/s)
    expect(mobileStyles).toMatch(/\.topbar-actions\s*{[^}]*grid-column:\s*1 \/ -1;[^}]*grid-row:\s*2;/s)
    expect(narrowStyles).toMatch(/\.language-switch\s*{[^}]*flex-direction:\s*column;/s)
    expect(narrowStyles).toMatch(/\.language-button\s*{[^}]*width:\s*100%;[^}]*padding:\s*var\(--space-2\);/s)
    expect(narrowStyles).toMatch(/h1\s*{[^}]*font-size:\s*1\.5rem;/s)
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

  it('marks the progress tracker as a shared scroll target', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('data-progress-target="steps"')
  })

  it('marks the active progress label for narrow-layout wrapping', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('progress-label active-progress-label')
    expect(html).toContain('>Fix the issue</span>')
  })

  it('keeps tablet labels focused and shows every desktop label without word breaks', () => {
    const baseStyles = styles.slice(0, styles.indexOf('@media'))
    const desktopStart = styles.indexOf('@media (min-width: 1001px)')
    const desktopStyles = styles.slice(desktopStart, styles.indexOf('@media print', desktopStart))

    expect(styles).toMatch(/\.progress-label\s*{[^}]*overflow-wrap:\s*normal;/s)
    expect(styles).not.toMatch(/\.progress-step\.active \.progress-label\s*{[^}]*overflow-wrap:\s*anywhere;/s)
    expect(baseStyles).toMatch(/\.progress-step\s*{[^}]*position:\s*relative;/s)
    expect(baseStyles).toMatch(/\.progress-label\s*{[^}]*font-size:\s*0;/s)
    expect(baseStyles).toMatch(/\.progress-step\.active \.progress-label\s*{[^}]*position:\s*absolute;/s)
    expect(baseStyles).not.toMatch(/\.progress-step:first-child\.active \.progress-label/)
    expect(styles.slice(styles.indexOf('@media (max-width: 599px)'))).toMatch(/\.progress-step:first-child\.active \.progress-label/)
    expect(desktopStyles).toMatch(/\.progress-label\s*{[^}]*font-size:\s*\.68rem;/s)
    expect(desktopStyles).toMatch(/\.progress-step\.active \.progress-label\s*{[^}]*position:\s*static;/s)
    expect(desktopStyles).toMatch(/\.progress-step\.active \.progress-label\s*{[^}]*font-size:\s*\.68rem;/s)
    expect(desktopStyles).not.toMatch(/100vw/)
  })

  it('keeps correction packet values in a right-hand column', () => {
    expect(styles).toMatch(/\.request-details div\s*{[^}]*display:\s*grid;[^}]*grid-template-columns:/s)
    expect(styles).toMatch(/\.request-details dd\s*{[^}]*justify-self:\s*end;/s)
  })

  it('renders Start over with button affordance', () => {
    expect(styles).toMatch(/\.text-button\s*{[^}]*border:\s*1px solid var\(--border\);/s)
    expect(styles).toMatch(/\.text-button\s*{[^}]*border-radius:/s)
    expect(styles).toMatch(/\.text-button\s*{[^}]*background:\s*var\(--surface\);/s)
  })

  it('renders the prototype warning copy without a flex-item gap', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('<span>All records and integrations are fictional or simulated. Do not enter real Aadhaar, bank, OTP, or government-login information.</span>')
  })
})
