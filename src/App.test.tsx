import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App, { DiagnosisAudit } from './App'
import { findPaymentCase } from './domain/cases'
import { diagnosePayment } from './domain/rules'

describe('dedicated recovery workspace', () => {
  it('links to phone studio without allowing recursive embedded studios', () => {
    expect(renderToStaticMarkup(<App />)).toContain('href="/frame"')
    expect(renderToStaticMarkup(<App embedded />)).not.toContain('href="/frame"')
  })
  it('keeps seven language choices and secondary actions in disclosures', () => {
    const html = renderToStaticMarkup(<App />)
    const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'))
    expect(header).toContain('aria-label="Change language"')
    expect(header).toContain('aria-label="More options"')
    for (const language of ['English', 'Hinglish', 'हिन्दी', 'मराठी', 'தமிழ்', 'తెలుగు', 'বাংলা']) expect(header).toContain(language)
    expect(header.match(/class="header-menu /g)).toHaveLength(2)
    expect(header).not.toContain('Start over')
    expect(header).not.toContain('Use assisted mode')
  })
  it('uses the requested demo menu labels and a non-glyph language chevron', () => {
    const html = renderToStaticMarkup(<App />)
    const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'))
    for (const text of ['Reset Demo', 'Assisted Mode', 'Mobile frame']) expect(header).toContain(text)
    expect(header).not.toContain('iPhone frame')
    expect(header).not.toContain('New example')
    expect(header).not.toContain('Larger text')
    expect(header).not.toContain('Standard text')
    expect(header).not.toContain('⌄')
    expect(renderToStaticMarkup(<App embedded />)).not.toContain('Mobile frame')
  })
  it('offers four safe starts with a return to the product page', () => {
    const html = renderToStaticMarkup(<App />)
    for (const text of ['Try a safe example', 'Use a fictional reference', 'Understand a status', 'I cannot access my status', 'href="/"', 'Do not enter real Aadhaar', 'English', 'हिन्दी']) expect(html).toContain(text)
    expect(html).not.toContain('Step 1 of 7')
  })
  it.each(['DBT-SUNITA-001', 'DBT-ARJUN-002', 'DBT-MEENA-003'])('shows %s answer and next action together', (reference) => {
    const html = renderToStaticMarkup(<App initialReference={reference} />)
    const diagnosis = diagnosePayment(findPaymentCase(reference)!)
    expect(html).toContain(diagnosis.reason)
    expect(html).toContain(diagnosis.owner)
    expect(html).toContain('Follow-up')
    expect(html).toContain('Prepare')
    expect(html).toContain('Payment trail')
  })
  it('retains the exact selected rule provenance', () => {
    const payment = findPaymentCase('DBT-ARJUN-002')!
    const html = renderToStaticMarkup(<DiagnosisAudit payment={payment} diagnosis={diagnosePayment(payment)} language="en" />)
    for (const text of ['destination-failed', 'DBT-ARJUN-002-RULE-1', 'INVALID_IFSC', 'PFMS validation and payment rejection remedies']) expect(html).toContain(text)
  })
})
