import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App, { DiagnosisAudit } from './App'
import { findPaymentCase } from './domain/cases'
import { diagnosePayment } from './domain/rules'

describe('dedicated recovery workspace', () => {
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
