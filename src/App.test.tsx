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
  })
})
