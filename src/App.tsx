import { useEffect, useMemo, useRef, useState } from 'react'
import { findPaymentCase, latestConfirmedEvent, PAYMENT_CASES, type PaymentCase } from './domain/cases'
import { advanceRecovery, buildCorrectionRequest, getRecoveryStates, RECOVERY_LABELS, type RecoveryState } from './domain/recovery'
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
  const label = status === 'confirmed'
    ? 'Confirmed'
    : status === 'failed'
      ? 'Stopped here'
      : status === 'conflict'
        ? 'Conflicting report'
        : 'No response'
  return <span className={`status-pill status-${status}`}>{label}</span>
}

function routeLabel(route: PaymentCase['route']) {
  return route === 'aadhaar' ? 'Aadhaar-based' : 'Account-based'
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
  const [recoveryState, setRecoveryState] = useState<RecoveryState>('needs-correction')
  const diagnosis = useMemo(() => payment ? diagnosePayment(payment) : null, [payment])
  const correctionRequest = useMemo(() => payment && diagnosis ? buildCorrectionRequest(payment, diagnosis) : null, [payment, diagnosis])
  const recoveryStates = diagnosis ? getRecoveryStates(diagnosis.recoveryType) : getRecoveryStates('correction')
  const latestEvent = payment ? latestConfirmedEvent(payment) : null
  const resultHeadingRef = useRef<HTMLHeadingElement>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (error) errorRef.current?.focus()
    else if (payment && step === 1) resultHeadingRef.current?.focus()
  }, [error, payment, step])

  function lookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = findPaymentCase(reference)
    if (!result) {
      setPayment(null)
      setError('We could not find that demo reference. Try DBT-MEENA-003.')
      setStep(0)
      setRecoveryState('needs-correction')
      return
    }
    setPayment(result)
    setError('')
    setRecoveryState(getRecoveryStates(diagnosePayment(result).recoveryType)[0])
    setStep(1)
  }

  function reset() {
    setPayment(null)
    setError('')
    setStep(0)
    setReference('DBT-MEENA-003')
    setRecoveryState('needs-correction')
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
              <label htmlFor="demo-case">Choose a fictional payment</label>
              <select id="demo-case" value={reference} onChange={(event) => setReference(event.target.value)}>
                {PAYMENT_CASES.map((demo) => <option value={demo.reference} key={demo.reference}>{demo.reference} · {demo.benefit} · {routeLabel(demo.route)}</option>)}
              </select>
              <label htmlFor="reference">Or enter a demo payment reference</label>
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
              {error && <p className="error-message" role="alert" tabIndex={-1} ref={errorRef}>{error}</p>}
              <button className="primary-button" type="submit">Show payment journey <span aria-hidden="true">→</span></button>
            </form>
          </section>
        )}

        {step === 1 && payment && (
          <section className="card" aria-labelledby="journey-title" aria-live="polite">
            <StepHeader step={1} payment={payment} />
            <h2 id="journey-title" tabIndex={-1} ref={resultHeadingRef}>{latestEvent?.status === 'confirmed' ? 'Where is the payment now?' : 'Where did it stop?'}</h2>
            <p className="lead">This is the path taken by the fictional payment. The latest confirmed event is marked below.</p>
            <p className="event-meta"><strong>Route:</strong> {routeLabel(payment.route)} <span aria-hidden="true">·</span> <strong>Latest confirmed:</strong> {latestEvent?.stage ?? 'No confirmed event'}</p>
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
                <p className="eyebrow">{diagnosis.recoveryType === 'trace' ? 'Payment reached another mapped account' : 'Payment stopped'}</p>
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
            <p className="eyebrow">{diagnosis.recoveryType === 'trace' ? 'What to check next?' : 'Who can fix this?'}</p>
            <h2 id="action-title">Start with {diagnosis.owner.toLowerCase()}</h2>
            <p className="lead">{diagnosis.action}</p>
            <div className="owner-card">
              <p className="eyebrow">Carry these documents</p>
              <ul className="check-list">
                {diagnosis.documents.map((document) => <li key={document}>{document}</li>)}
              </ul>
            </div>
            <p className="muted">Next simulated state: {diagnosis.nextState}. This demo does not change a real bank or scheme record.</p>
            <div className="button-row">
              <button className="secondary-button" type="button" onClick={() => setStep(2)}>Back</button>
              <button className="primary-button" type="button" onClick={() => setStep(4)}>Prepare {diagnosis.recoveryType === 'trace' ? 'trace' : 'correction'} request <span aria-hidden="true">→</span></button>
            </div>
          </section>
        )}

        {step === 4 && payment && diagnosis && correctionRequest && (
          <section className="card" aria-labelledby="packet-title">
            <StepHeader step={4} payment={payment} />
            <div className="printable-packet">
              <p className="eyebrow">Fictional {correctionRequest.requestType === 'trace' ? 'trace' : 'correction'} request</p>
              <h2 id="packet-title">Take this to {correctionRequest.owner.toLowerCase()}</h2>
              <p className="muted">Print this page or show it at the branch. It contains only synthetic demo information.</p>
              <dl className="request-details">
                <div><dt>Demo reference</dt><dd>{correctionRequest.reference}</dd></div>
                <div><dt>Beneficiary</dt><dd>{correctionRequest.beneficiary}</dd></div>
                <div><dt>Benefit</dt><dd>{correctionRequest.scheme}</dd></div>
                <div><dt>Account shown in demo</dt><dd>{correctionRequest.account}</dd></div>
              </dl>
              <div className="request-action">
                <p className="eyebrow">Ask for this action</p>
                <p>{correctionRequest.action}</p>
              </div>
              <p className="eyebrow">Carry</p>
              <ul className="check-list">
                {correctionRequest.documents.map((document) => <li key={document}>{document}</li>)}
              </ul>
            </div>
            <div className="button-row">
              <button className="secondary-button" type="button" onClick={() => setStep(3)}>Back</button>
              <button className="secondary-button" type="button" onClick={() => window.print()}>Print request</button>
              <button className="primary-button" type="button" onClick={() => { setRecoveryState(recoveryStates[1] ?? recoveryStates[0]); setStep(5) }}>Record fictional acknowledgement <span aria-hidden="true">→</span></button>
            </div>
          </section>
        )}

        {step === 5 && payment && diagnosis && (
          <section className="card" aria-labelledby="acknowledgement-title" aria-live="polite">
            <StepHeader step={5} payment={payment} />
            <p className="eyebrow">Fictional acknowledgement</p>
            <h2 id="acknowledgement-title">Your {diagnosis.recoveryType === 'trace' ? 'trace request' : 'correction request'} is recorded</h2>
            <p className="lead">This acknowledgement is simulated for the demo. In a real service, the responsible organisation would provide its own confirmation.</p>
            <div className="acknowledgement-card">
              <strong>{payment.reference}</strong>
              <span>{diagnosis.recoveryType === 'trace' ? 'Bank trace request submitted' : `${diagnosis.owner} correction submitted`}</span>
              <small>Reference: ACK-DEMO-{payment.reference.slice(-3)} · 18 August 2026, 10:05 AM IST</small>
            </div>
            <div className="button-row">
              <button className="secondary-button" type="button" onClick={() => setStep(4)}>Back</button>
              <button className="primary-button" type="button" onClick={() => setStep(6)}>Track recovery <span aria-hidden="true">→</span></button>
            </div>
          </section>
        )}

        {step === 6 && payment && diagnosis && (
          <section className="card" aria-labelledby="recovery-title" aria-live="polite">
            <StepHeader step={6} payment={payment} />
            <p className="eyebrow">Simulated tracker</p>
            <h2 id="recovery-title">Follow what happens next</h2>
            <p className="lead">This demo keeps the next steps visible without claiming that a local action changed a real account.</p>
            <ol className="recovery-list">
              {recoveryStates.map((state) => {
                const currentIndex = recoveryStates.indexOf(recoveryState)
                const stateIndex = recoveryStates.indexOf(state)
                return <li className={stateIndex <= currentIndex ? 'recovery-item reached' : 'recovery-item'} key={state}>
                  <span className="recovery-dot" aria-hidden="true">{stateIndex <= currentIndex ? '✓' : stateIndex + 1}</span>
                  <span>{RECOVERY_LABELS[state]}</span>
                </li>
              })}
            </ol>
            {recoveryState !== recoveryStates[recoveryStates.length - 1] ? (
              <button className="primary-button" type="button" onClick={() => setRecoveryState(advanceRecovery(recoveryState, diagnosis.recoveryType))}>Show next simulated update <span aria-hidden="true">→</span></button>
            ) : (
              <div className="success-message" role="status"><strong>{RECOVERY_LABELS[recoveryState]} in this demo.</strong> This is a simulated final state, not a real bank confirmation.</div>
            )}
            <div className="button-row">
              <button className="secondary-button" type="button" onClick={() => setStep(4)}>View request</button>
              <button className="text-button" type="button" onClick={reset}>Start another demo</button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
