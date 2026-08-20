import { useMemo, useState } from 'react'
import { findPaymentCase, type PaymentCase } from './domain/cases'
import { diagnosePayment } from './domain/rules'

const STEPS = [
  'Find payment',
  'Payment journey',
  'Why it stopped',
  'Fix it',
  'Correction packet',
  'Acknowledgement',
  'Recovery tracker',
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value))
}

function StatusPill({ status }: { status: string }) {
  const label = status === 'confirmed' ? 'Confirmed' : status === 'failed' ? 'Stopped here' : 'Not received'
  return <span className={`status-pill status-${status}`}>{label}</span>
}

function PrototypeNotice() {
  return (
    <aside className="prototype-notice" aria-label="Safety notice">
      <strong>Independent hackathon prototype</strong>
      <span>All records and integrations are fictional or simulated.</span>
      <span>Do not enter real Aadhaar, bank, OTP, or government-login information.</span>
    </aside>
  )
}

function StepHeader({ step, payment }: { step: number; payment: PaymentCase | null }) {
  return (
    <div className="step-header">
      <p className="eyebrow">Step {step + 1} of {STEPS.length}</p>
      <p className="step-name">{STEPS[step]}</p>
      {payment && <p className="muted">{payment.reference} · {payment.scheme}</p>}
    </div>
  )
}

export default function App() {
  const [reference, setReference] = useState('DBT-MEENA-003')
  const [payment, setPayment] = useState<PaymentCase | null>(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState(0)
  const diagnosis = useMemo(() => payment ? diagnosePayment(payment) : null, [payment])

  function lookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = findPaymentCase(reference)
    if (!result) {
      setPayment(null)
      setError('We could not find that demo reference. Try DBT-MEENA-003.')
      return
    }
    setPayment(result)
    setError('')
    setStep(1)
  }

  function reset() {
    setPayment(null)
    setError('')
    setStep(0)
    setReference('DBT-MEENA-003')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-kicker">Paisa Kahan Atka?</p>
          <h1>DBT Rescue</h1>
        </div>
        <button className="text-button" type="button" onClick={reset}>Start over</button>
      </header>

      <PrototypeNotice />

      <main className="content" id="main-content">
        <nav className="progress" aria-label="Payment recovery progress">
          {STEPS.map((label, index) => (
            <span className={index === step ? 'progress-step active' : index < step ? 'progress-step complete' : 'progress-step'} key={label}>
              <span className="progress-number">{index + 1}</span>
              <span className="progress-label">{label}</span>
            </span>
          ))}
        </nav>

        {step === 0 && (
          <section className="card hero-card" aria-labelledby="lookup-title">
            <StepHeader step={0} payment={payment} />
            <h2 id="lookup-title">Find your payment</h2>
            <p className="lead">See where a government benefit payment stopped, why it stopped, and what to do next.</p>
            <form onSubmit={lookup}>
              <label htmlFor="reference">Demo payment reference</label>
              <input
                id="reference"
                name="reference"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                autoComplete="off"
                spellCheck={false}
                aria-describedby="reference-help"
              />
              <p className="field-help" id="reference-help">Try the fictional reference shown above. No personal information is needed.</p>
              {error && <p className="error-message" role="alert">{error}</p>}
              <button className="primary-button" type="submit">Show payment journey <span aria-hidden="true">→</span></button>
            </form>
          </section>
        )}

        {step === 1 && payment && (
          <section className="card" aria-labelledby="journey-title" aria-live="polite">
            <StepHeader step={1} payment={payment} />
            <h2 id="journey-title">Where did it stop?</h2>
            <p className="lead">This is the path taken by the fictional payment. The latest confirmed event is marked below.</p>
            <ol className="timeline">
              {payment.events.map((event) => (
                <li className="timeline-item" key={event.id}>
                  <div className="timeline-marker" aria-hidden="true" />
                  <div className="timeline-content">
                    <div className="timeline-title-row">
                      <h3>{event.stage}</h3>
                      <StatusPill status={event.status} />
                    </div>
                    <p>{event.detail}</p>
                    <p className="event-meta"><strong>Source:</strong> {event.source} <span aria-hidden="true">·</span> <time dateTime={event.timestamp}>{formatDate(event.timestamp)}</time></p>
                    <small className="simulated-label">SIMULATED EVENT</small>
                  </div>
                </li>
              ))}
            </ol>
            <div className="button-row">
              <button className="secondary-button" type="button" onClick={() => setStep(0)}>Back</button>
              <button className="primary-button" type="button" onClick={() => setStep(2)}>Explain this status <span aria-hidden="true">→</span></button>
            </div>
          </section>
        )}

        {step === 2 && payment && diagnosis && (
          <section className="card" aria-labelledby="diagnosis-title" aria-live="polite">
            <StepHeader step={2} payment={payment} />
            <div className="signal-card">
              <span className="signal-icon" aria-hidden="true">!</span>
              <div>
                <p className="eyebrow">Payment stopped</p>
                <h2 id="diagnosis-title">{diagnosis.reason}</h2>
              </div>
            </div>
            <p className="lead">{diagnosis.explanation}</p>
            <details className="technical-details">
              <summary>Show technical detail</summary>
              <p>Demo reason code: <code>{diagnosis.technicalReason}</code></p>
              <p>This response is a reviewed, deterministic demo rule. It is not a live payment response.</p>
            </details>
            <div className="button-row">
              <button className="secondary-button" type="button" onClick={() => setStep(1)}>Back</button>
              <button className="primary-button" type="button" onClick={() => setStep(3)}>See how to fix it <span aria-hidden="true">→</span></button>
            </div>
          </section>
        )}

        {step === 3 && payment && diagnosis && (
          <section className="card" aria-labelledby="action-title">
            <StepHeader step={3} payment={payment} />
            <p className="eyebrow">Who can fix this?</p>
            <h2 id="action-title">Start with {diagnosis.owner.toLowerCase()}</h2>
            <p className="lead">{diagnosis.action}</p>
            <div className="owner-card">
              <p className="eyebrow">Carry these documents</p>
              <ul className="check-list">
                {diagnosis.documents.map((document) => <li key={document}>{document}</li>)}
              </ul>
            </div>
            <p className="muted">After the bank confirms the mapping, the pension office still needs to update and reprocess the payment. A bank correction does not release money automatically.</p>
            <div className="button-row">
              <button className="secondary-button" type="button" onClick={() => setStep(2)}>Back</button>
              <button className="primary-button" type="button" onClick={() => setStep(4)}>Prepare correction packet <span aria-hidden="true">→</span></button>
            </div>
          </section>
        )}

        {step > 3 && (
          <section className="card" aria-labelledby="next-title">
            <StepHeader step={step} payment={payment} />
            <h2 id="next-title">This recovery step is next</h2>
            <p className="lead">The correction packet and simulated recovery tracker are being completed in the next task.</p>
            <button className="secondary-button" type="button" onClick={() => setStep(3)}>Back to action</button>
          </section>
        )}
      </main>
    </div>
  )
}
