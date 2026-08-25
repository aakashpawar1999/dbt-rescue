import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { findPaymentCase, latestConfirmedEvent, PAYMENT_CASES, type PaymentCase, type PaymentEvent } from './domain/cases'
import { advanceRecovery, buildCorrectionRequest, getRecoveryStates, type RecoveryState } from './domain/recovery'
import { diagnosePayment, type PaymentDiagnosis } from './domain/rules'
import { getCaseCopy, getDiagnosisCopy, recoveryLabel, t, type Language, type TextKey } from './i18n'

const STEP_KEYS: TextKey[] = ['findPayment', 'paymentJourney', 'whyStopped', 'fixIt', 'correctionPacket', 'acknowledgement', 'recoveryTracker']

function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata',
  }).format(new Date(value))
}

function StatusPill({ status, language }: { status: PaymentEvent['status']; language: Language }) {
  const key: TextKey = status === 'confirmed' ? 'confirmed' : status === 'failed' ? 'failed' : status === 'conflict' ? 'conflict' : 'missing'
  return <span className={`status-pill status-${status}`}>{t(language, key)}</span>
}

function routeLabel(route: PaymentCase['route'], language: Language) {
  return t(language, route === 'aadhaar' ? 'routeAadhaar' : 'routeAccount')
}

function PrototypeNotice({ language }: { language: Language }) {
  return <aside className="prototype-notice" aria-label={t(language, 'safetyLabel')}>
    <strong>{t(language, 'prototype')}</strong>
    <span>{t(language, 'fictionalRecords')}</span>
    <span>{t(language, 'noRealInfo')}</span>
  </aside>
}

function LanguageToggle({ language, onChange }: { language: Language; onChange: (language: Language) => void }) {
  return <div className="language-switch" role="group" aria-label={t(language, 'language')}>
    <span className="sr-only">{t(language, 'language')}</span>
    <button className="language-button" type="button" aria-pressed={language === 'en'} onClick={() => onChange('en')}>{t(language, 'english')}</button>
    <button className="language-button" type="button" aria-pressed={language === 'hi'} onClick={() => onChange('hi')}>{t(language, 'hindi')}</button>
  </div>
}

function ModeToggle({ language, assisted, onChange }: { language: Language; assisted: boolean; onChange: () => void }) {
  return <button className="mode-button" type="button" aria-pressed={assisted} onClick={onChange}>{t(language, assisted ? 'directMode' : 'assistedMode')}</button>
}

function StepHeader({ step, payment, language }: { step: number; payment: PaymentCase | null; language: Language }) {
  return <div className="step-header">
    <p className="eyebrow">{t(language, 'stepOf', { step: String(step + 1) })}</p>
    <p className="step-name">{t(language, STEP_KEYS[step])}</p>
    {payment && <p className="muted">{payment.reference} · {payment.scheme}</p>}
  </div>
}

export function DiagnosisAudit({ payment, diagnosis, language }: { payment: PaymentCase; diagnosis: PaymentDiagnosis; language: Language }) {
  const event = payment.events.find((candidate) => candidate.id === diagnosis.provenance.matchedEventId)
  const provenance = diagnosis.provenance

  return <details className="technical-details audit-details">
    <summary>{t(language, 'auditTitle')}</summary>
    <p className="audit-decision">{t(language, provenance.reviewerStatus === 'human-reviewed' ? 'auditDecision' : 'auditUnreviewed', { owner: diagnosis.owner })}</p>
    <dl className="audit-grid">
      <div><dt>{t(language, 'auditEvent')}</dt><dd>{event?.id ?? provenance.matchedEventId} · {event?.stage ?? payment.scheme}</dd></div>
      <div><dt>{t(language, 'auditRawReason')}</dt><dd><code>{provenance.rawReason}</code></dd></div>
      <div><dt>{t(language, 'auditRule')}</dt><dd>{provenance.ruleId}</dd></div>
      <div><dt>{t(language, 'auditVersion')}</dt><dd>{provenance.version}</dd></div>
      <div><dt>{t(language, 'auditScope')}</dt><dd>{provenance.schemeScope} · {routeLabel(provenance.route, language)}</dd></div>
      <div><dt>{t(language, 'auditReview')}</dt><dd>{provenance.reviewerStatus} · {provenance.reviewDate}</dd></div>
      <div><dt>{t(language, 'auditSource')}</dt><dd>{provenance.sourceUrl ? <a href={provenance.sourceUrl} target="_blank" rel="noreferrer">{provenance.sourceTitle}</a> : provenance.sourceTitle}</dd></div>
    </dl>
  </details>
}

export default function App() {
  const [reference, setReference] = useState('DBT-SUNITA-001')
  const [payment, setPayment] = useState<PaymentCase | null>(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState(0)
  const [language, setLanguage] = useState<Language>('en')
  const [assisted, setAssisted] = useState(false)
  const [recoveryState, setRecoveryState] = useState<RecoveryState>('needs-correction')
  const [announcement, setAnnouncement] = useState('')
  const diagnosis = useMemo(() => payment ? diagnosePayment(payment) : null, [payment])
  const caseCopy = payment ? getCaseCopy(payment.reference, language) : null
  const diagnosisCopy = payment && diagnosis ? getDiagnosisCopy(payment.reference, language) : null
  const localizedPayment = payment && caseCopy ? {
    ...payment,
    scheme: caseCopy.scheme,
    benefit: caseCopy.benefit,
    maskedAccount: caseCopy.maskedAccount,
    events: payment.events.map((event, index) => ({ ...event, ...caseCopy.events[index] })),
  } : payment
  const localizedDiagnosis = diagnosis && diagnosisCopy ? { ...diagnosis, ...diagnosisCopy } : diagnosis
  const correctionRequest = payment && diagnosis && localizedDiagnosis && caseCopy ? {
    ...buildCorrectionRequest(payment, diagnosis),
    scheme: caseCopy.scheme,
    account: caseCopy.maskedAccount,
    owner: localizedDiagnosis.owner,
    action: localizedDiagnosis.action,
    documents: localizedDiagnosis.documents,
    nextState: localizedDiagnosis.nextState,
  } : null
  const recoveryStates = diagnosis ? getRecoveryStates(diagnosis.recoveryType) : getRecoveryStates('correction')
  const latestEvent = payment ? latestConfirmedEvent(payment) : null
  const localizedLatestEvent = localizedPayment?.events.find((event) => event.id === latestEvent?.id) ?? null
  const resultHeadingRef = useRef<HTMLHeadingElement>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const historyStep = event.state?.dbtStep
      setStep(typeof historyStep === 'number' ? Math.max(0, Math.min(6, historyStep)) : 0)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (error) errorRef.current?.focus()
    else if (payment && step === 1) resultHeadingRef.current?.focus()
  }, [error, payment, step])

  function goTo(nextStep: number) {
    setStep(nextStep)
    window.history.pushState({ dbtStep: nextStep }, '', window.location.href)
  }

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage)
    setAnnouncement(`${t(nextLanguage, 'language')}: ${t(nextLanguage, nextLanguage === 'hi' ? 'hindi' : 'english')}`)
  }

  function toggleAssisted() {
    const nextAssisted = !assisted
    setAssisted(nextAssisted)
    setAnnouncement(t(language, nextAssisted ? 'helperRole' : 'citizenIntro'))
  }

  function lookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = findPaymentCase(reference)
    if (!result) {
      setPayment(null)
      setError(t(language, 'unknownReference'))
      setStep(0)
      setRecoveryState('needs-correction')
      setAnnouncement(t(language, 'unknownReference'))
      return
    }
    setPayment(result)
    setError('')
    setRecoveryState(getRecoveryStates(diagnosePayment(result).recoveryType)[0])
    goTo(1)
    setAnnouncement(t(language, result.events.some((item) => item.status === 'failed') ? 'whereStopped' : 'whereNow'))
  }

  function reset() {
    setPayment(null)
    setError('')
    setStep(0)
    setReference('DBT-SUNITA-001')
    setRecoveryState('needs-correction')
    setAnnouncement(t(language, 'findYourPayment'))
    window.history.replaceState({ dbtStep: 0 }, '', window.location.href)
  }

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-lockup"><img className="brand-mark" src="/logo.png" alt="DBT Rescue logo" width="48" height="48" /><div><p className="brand-kicker">{t(language, 'brandKicker')}</p><h1>{t(language, 'title')}</h1></div></div>
      <div className="topbar-actions">
        <LanguageToggle language={language} onChange={changeLanguage} />
        <ModeToggle language={language} assisted={assisted} onChange={toggleAssisted} />
        <button className="text-button" type="button" onClick={reset}>{t(language, 'startOver')}</button>
      </div>
    </header>

    <PrototypeNotice language={language} />

    <main className="content" id="main-content">
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      <details className="disclosure"><summary>{t(language, 'disclosureTitle')}</summary><p>{t(language, 'disclosureBody')}</p><p><a href="https://github.com/aakashpawar1999/dbt-rescue/blob/main/docs/functional-vs-simulated.md" target="_blank" rel="noreferrer">{t(language, 'functionalDisclosure')}</a> · <a href="https://github.com/aakashpawar1999/dbt-rescue/blob/main/docs/known-limitations.md" target="_blank" rel="noreferrer">{t(language, 'knownLimitations')}</a></p></details>

      <nav className="progress" aria-label={`${t(language, 'recoveryTracker')}: ${t(language, STEP_KEYS[step])}`}>
        {STEP_KEYS.map((key, index) => <span className={index === step ? 'progress-step active' : index < step ? 'progress-step complete' : 'progress-step'} aria-current={index === step ? 'step' : undefined} key={key}>
          <span className="progress-number">{index + 1}</span><span className="progress-label">{t(language, key)}</span>
        </span>)}
      </nav>

      {step === 0 && <section className="card hero-card" aria-labelledby="lookup-title">
        <StepHeader step={0} payment={localizedPayment} language={language} />
        {assisted && payment && <p className="assisted-banner">{t(language, 'helperIntro', { beneficiary: payment.beneficiaryName })}</p>}
        <h2 id="lookup-title">{t(language, 'findYourPayment')}</h2>
        <p className="lead">{t(language, assisted ? 'findLeadAssisted' : 'findLead')}</p>
        <form onSubmit={lookup}>
          <label htmlFor="demo-case">{t(language, 'chooseFictional')}</label>
          <select id="demo-case" value={reference} onChange={(event) => setReference(event.target.value)}>
            {PAYMENT_CASES.map((demo) => { const demoCopy = getCaseCopy(demo.reference, language); return <option value={demo.reference} key={demo.reference}>{demo.reference} · {demoCopy?.benefit} · {routeLabel(demo.route, language)}</option> })}
          </select>
          <label htmlFor="reference">{t(language, 'enterReference')}</label>
          <input id="reference" name="reference" value={reference} onChange={(event) => setReference(event.target.value)} autoComplete="off" spellCheck={false} aria-invalid={Boolean(error)} aria-describedby={`reference-help${error ? ' reference-error' : ''}`} />
          <p className="field-help" id="reference-help">{t(language, 'referenceHelp')}</p>
          {error && <p className="error-message" id="reference-error" role="alert" tabIndex={-1} ref={errorRef}>{error}</p>}
          <button className="primary-button" type="submit">{t(language, 'showJourney')} <span aria-hidden="true">→</span></button>
        </form>
      </section>}

      {step === 1 && localizedPayment && <section className="card" aria-labelledby="journey-title">
        <StepHeader step={1} payment={localizedPayment} language={language} />
        {assisted && <p className="assisted-banner">{t(language, 'helperIntro', { beneficiary: localizedPayment.beneficiaryName })}</p>}
        <h2 id="journey-title" tabIndex={-1} ref={resultHeadingRef}>{localizedLatestEvent?.status === 'confirmed' ? t(language, 'whereNow') : t(language, 'whereStopped')}</h2>
        <p className="lead">{t(language, 'journeyLead')}</p>
        <p className="event-meta"><strong>{t(language, 'route')}:</strong> {routeLabel(localizedPayment.route, language)} <span aria-hidden="true">·</span> <strong>{t(language, 'latestConfirmed')}:</strong> {localizedLatestEvent?.stage ?? t(language, 'noConfirmed')}</p>
        <ol className="timeline">{localizedPayment.events.map((event) => <li className="timeline-item" key={event.id}>
          <div className="timeline-marker" aria-hidden="true" /><div className="timeline-content"><div className="timeline-title-row"><h3>{event.stage}</h3><StatusPill status={event.status} language={language} /></div>
            <p>{event.detail}</p><p className="event-meta"><strong>{t(language, 'source')}:</strong> {event.source} <span aria-hidden="true">·</span> <time dateTime={event.timestamp}>{formatDate(event.timestamp, language)}</time></p><small className="simulated-label">{t(language, 'simulatedEvent')}</small>
          </div>
        </li>)}</ol>
        <div className="button-row"><button className="secondary-button" type="button" onClick={() => goTo(0)}>{t(language, 'back')}</button><button className="primary-button" type="button" onClick={() => goTo(2)}>{t(language, 'explainStatus')} <span aria-hidden="true">→</span></button></div>
      </section>}

      {step === 2 && localizedPayment && localizedDiagnosis && <section className="card" aria-labelledby="diagnosis-title">
        <StepHeader step={2} payment={localizedPayment} language={language} /><div className="signal-card"><span className="signal-icon" aria-hidden="true">!</span><div><p className="eyebrow">{t(language, localizedDiagnosis.recoveryType === 'trace' ? 'paymentReached' : 'paymentStopped')}</p><h2 id="diagnosis-title">{localizedDiagnosis.reason}</h2></div></div>
        <p className="lead">{localizedDiagnosis.explanation}</p><details className="technical-details"><summary>{t(language, 'showTechnical')}</summary><p>{t(language, 'technicalReason', { code: localizedDiagnosis.technicalReason })}</p><p>{t(language, 'reviewedRule')}</p></details><DiagnosisAudit payment={localizedPayment} diagnosis={localizedDiagnosis} language={language} />
        <div className="button-row"><button className="secondary-button" type="button" onClick={() => goTo(1)}>{t(language, 'back')}</button><button className="primary-button" type="button" onClick={() => goTo(3)}>{t(language, 'seeFix')} <span aria-hidden="true">→</span></button></div>
      </section>}

      {step === 3 && localizedPayment && localizedDiagnosis && <section className="card" aria-labelledby="action-title">
        <StepHeader step={3} payment={localizedPayment} language={language} /><p className="eyebrow">{t(language, localizedDiagnosis.recoveryType === 'trace' ? 'whatCheck' : 'whoCanFix')}</p><h2 id="action-title">{t(language, 'startWith', { owner: localizedDiagnosis.owner })}</h2><p className="lead">{localizedDiagnosis.action}</p>
        <div className="owner-card"><p className="eyebrow">{t(language, 'carryDocuments')}</p><ul className="check-list">{localizedDiagnosis.documents.map((document) => <li key={document}>{document}</li>)}</ul></div><p className="muted">{t(language, 'nextSimulated', { state: localizedDiagnosis.nextState })}</p>
        <div className="button-row"><button className="secondary-button" type="button" onClick={() => goTo(2)}>{t(language, 'back')}</button><button className="primary-button" type="button" onClick={() => goTo(4)}>{t(language, localizedDiagnosis.recoveryType === 'trace' ? 'prepareTrace' : 'prepareCorrection')} <span aria-hidden="true">→</span></button></div>
      </section>}

      {step === 4 && localizedPayment && localizedDiagnosis && correctionRequest && <section className="card" aria-labelledby="packet-title">
        <StepHeader step={4} payment={localizedPayment} language={language} /><div className="printable-packet"><p className="eyebrow">{t(language, correctionRequest.requestType === 'trace' ? 'fictionalTraceRequest' : 'fictionalCorrectionRequest')}</p><h2 id="packet-title">{t(language, 'packetTitle', { owner: correctionRequest.owner })}</h2><p className="muted">{t(language, 'packetLead')}</p>
          <dl className="request-details"><div><dt>{t(language, 'demoReference')}</dt><dd>{correctionRequest.reference}</dd></div><div><dt>{t(language, 'beneficiary')}</dt><dd>{correctionRequest.beneficiary}</dd></div><div><dt>{t(language, 'benefit')}</dt><dd>{correctionRequest.scheme}</dd></div><div><dt>{t(language, 'accountShown')}</dt><dd>{correctionRequest.account}</dd></div>{localizedLatestEvent && <div><dt>{t(language, 'source')}</dt><dd>{localizedLatestEvent.source} · <time dateTime={localizedLatestEvent.timestamp}>{formatDate(localizedLatestEvent.timestamp, language)}</time></dd></div>}</dl>
          <div className="request-action"><p className="eyebrow">{t(language, 'askAction')}</p><p>{correctionRequest.action}</p></div><p className="eyebrow">{t(language, 'carry')}</p><ul className="check-list">{correctionRequest.documents.map((document) => <li key={document}>{document}</li>)}</ul>
        </div><div className="button-row"><button className="secondary-button" type="button" onClick={() => goTo(3)}>{t(language, 'back')}</button><button className="secondary-button" type="button" onClick={() => window.print()}>{t(language, 'printRequest')}</button><button className="primary-button" type="button" onClick={() => { setRecoveryState(recoveryStates[1] ?? recoveryStates[0]); goTo(5); setAnnouncement(t(language, 'fictionalAcknowledgement')) }}>{t(language, 'recordAcknowledgement')} <span aria-hidden="true">→</span></button></div>
      </section>}

      {step === 5 && localizedPayment && localizedDiagnosis && <section className="card" aria-labelledby="acknowledgement-title">
        <StepHeader step={5} payment={localizedPayment} language={language} /><p className="eyebrow">{t(language, 'fictionalAcknowledgement')}</p><h2 id="acknowledgement-title">{t(language, 'recorded', { request: t(language, localizedDiagnosis.recoveryType === 'trace' ? 'traceRequest' : 'correctionRequest') })}</h2><p className="lead">{t(language, 'acknowledgementLead')}</p>
        <div className="acknowledgement-card"><strong>{localizedPayment.reference}</strong><span>{localizedDiagnosis.recoveryType === 'trace' ? t(language, 'bankTraceSubmitted') : t(language, 'correctionSubmitted', { owner: localizedDiagnosis.owner })}</span><small>{t(language, 'ackReference', { reference: localizedPayment.reference.slice(-3) })}</small></div>
        <div className="button-row"><button className="secondary-button" type="button" onClick={() => goTo(4)}>{t(language, 'back')}</button><button className="primary-button" type="button" onClick={() => { goTo(6); setAnnouncement(t(language, 'trackRecovery')) }}>{t(language, 'trackRecovery')} <span aria-hidden="true">→</span></button></div>
      </section>}

      {step === 6 && localizedPayment && localizedDiagnosis && <section className="card" aria-labelledby="recovery-title">
        <StepHeader step={6} payment={localizedPayment} language={language} /><p className="eyebrow">{t(language, 'simulatedTracker')}</p><h2 id="recovery-title">{t(language, 'trackerTitle')}</h2><p className="lead">{t(language, 'trackerLead')}</p>
        <ol className="recovery-list">{recoveryStates.map((state) => { const currentIndex = recoveryStates.indexOf(recoveryState); const stateIndex = recoveryStates.indexOf(state); return <li className={stateIndex <= currentIndex ? 'recovery-item reached' : 'recovery-item'} key={state}><span className="recovery-dot" aria-hidden="true">{stateIndex <= currentIndex ? '✓' : stateIndex + 1}</span><span>{recoveryLabel(language, state)}</span></li> })}</ol>
        {recoveryState !== recoveryStates[recoveryStates.length - 1] ? <button className="primary-button" type="button" onClick={() => { const nextState = advanceRecovery(recoveryState, localizedDiagnosis.recoveryType); setRecoveryState(nextState); setAnnouncement(recoveryLabel(language, nextState)) }}>{t(language, 'showNext')} <span aria-hidden="true">→</span></button> : <div className="success-message" role="status"><strong>{t(language, 'finalState', { state: recoveryLabel(language, recoveryState) })}</strong></div>}
        <div className="button-row"><button className="secondary-button" type="button" onClick={() => goTo(4)}>{t(language, 'viewRequest')}</button><button className="text-button" type="button" onClick={reset}>{t(language, 'startAnother')}</button></div>
      </section>}
    </main>
    <footer className="site-footer" aria-label={t(language, 'footerLabel')}>
      <p><strong>{t(language, 'hackathonProject')}</strong></p>
      <p>{t(language, 'footerDisclosure')}</p>
      <p>{t(language, 'footerSafety')}</p>
    </footer>
  </div>
}
