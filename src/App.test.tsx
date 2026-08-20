import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('DBT Rescue safe entry point', () => {
  it('starts with the fictional reference and a clear prototype warning', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('Independent hackathon prototype')
    expect(html).toContain('DBT-MEENA-003')
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
    expect(html).toContain('aria-live="polite"')
  })

  it('exposes names and instructions for critical controls', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('role="group" aria-label="Language"')
    expect(html).toContain('aria-describedby="reference-help"')
    expect(html).toContain('What works and what is simulated')
    expect(html).toContain('role="status" aria-live="polite"')
  })
})
