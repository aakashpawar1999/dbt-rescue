import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { findPaymentCase, latestConfirmedEvent, PAYMENT_CASES, type PaymentCase, type PaymentEvent } from './domain/cases'
import { advanceRecovery, buildCorrectionRequest, getRecoveryStates, type RecoveryState } from './domain/recovery'
import { diagnosePayment, type PaymentDiagnosis } from './domain/rules'
import { readNavigation } from './domain/navigation'
import { readResume, RESUME_KEY, RESUME_LIFETIME } from './domain/resume'
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
    <span>{t(language, 'fictionalRecords')} {t(language, 'noRealInfo')}</span>
  </aside>
}

function LanguageToggle({ language, onChange }: { language: Language; onChange: (language: Language) => void }) {
  return <div className="language-switch">
    <select className="language-select" aria-label={t(language, 'language')} value={language} onChange={(event) => onChange(event.currentTarget.value === 'hi' ? 'hi' : 'en')}>
      <option value="en">{t(language, 'english')}</option>
      <option value="hi">{t(language, 'hindi')}</option>
    </select>
  </div>
}

function ModeToggle({ language, assisted, onChange }: { language: Language; assisted: boolean; onChange: () => void }) {
  return <button className="mode-button" type="button" aria-pressed={assisted} onClick={onChange}>{t(language, assisted ? 'directMode' : 'assistedMode')}</button>
}

function StepHeader({ step, payment, language }: { step: number; payment: PaymentCase | null; language: Language }) {
  return <div className="step-header">
    <p className="step-caption">{t(language, STEP_KEYS[step])}</p>
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

export default function App({ initialReference = '', embedded = false }: { initialReference?: string; embedded?: boolean }) {
  const [saved] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      const restored = readResume(window.localStorage.getItem(RESUME_KEY), Date.now())
      return initialReference && restored?.payment.reference !== initialReference ? null : restored
    } catch { return null }
  })
  const initialPayment = findPaymentCase(initialReference) ?? saved?.payment ?? null
  const [reference, setReference] = useState(initialPayment?.reference ?? 'DBT-SUNITA-001')
  const [payment, setPayment] = useState<PaymentCase | null>(initialPayment)
  const [error, setError] = useState('')
  const [step, setStep] = useState(saved?.step ?? (initialPayment ? 1 : 0))
  const [startPath, setStartPath] = useState<'example' | 'reference' | 'status' | 'access' | null>(null)
  const [statusRule, setStatusRule] = useState('UNKNOWN-RAW-REASON')
  const [language, setLanguage] = useState<Language>(saved?.language ?? 'en')
  const [assisted, setAssisted] = useState(saved?.assisted ?? false)
  const [recoveryState, setRecoveryState] = useState<RecoveryState>(saved?.recoveryState ?? (initialPayment ? getRecoveryStates(diagnosePayment(initialPayment).recoveryType)[0] : 'needs-correction'))
  const [announcement, setAnnouncement] = useState('')
  const [creditEvent, setCreditEvent] = useState<PaymentEvent | null>(saved?.creditEvent ?? null)
  const [storageUnavailable, setStorageUnavailable] = useState(false)
  const expiresAt = useRef(saved?.expiresAt ?? Date.now() + RESUME_LIFETIME)
  const diagnosis = useMemo(() => payment ? diagnosePayment(payment) : null, [payment])
  const caseCopy = payment ? getCaseCopy(payment.reference, language) : null
  const diagnosisCopy = diagnosis ? getDiagnosisCopy(diagnosis.provenance.ruleId, language) : null
  const localizedPayment = payment && caseCopy ? {
    ...payment,
    scheme: caseCopy.scheme,
    benefit: caseCopy.benefit,
    maskedAccount: caseCopy.maskedAccount,
    events: payment.events.map((event) => ({ ...event, ...caseCopy.events.find((copy) => copy.id === event.id) })),
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
  const say = (english: string, hindi: string) => language === 'hi' ? hindi : english
  const statusCopy = getDiagnosisCopy(statusRule, language)!
  const historyGeneration = useRef('')

  useEffect(() => { document.documentElement.lang = language }, [language])

  useEffect(() => {
    historyGeneration.current = saved?.generation ?? crypto.randomUUID()
    window.history.replaceState(null, '', window.location.href)
    const onPopState = (event: PopStateEvent) => {
      const restored = readNavigation(event.state, historyGeneration.current, Date.now())
      setPayment(restored?.payment ?? null)
      setStep(restored ? (restored.step > 0 && restored.step < 4 ? 1 : restored.step) : 0)
      setRecoveryState(restored?.recoveryState ?? 'needs-correction')
      setCreditEvent(restored?.creditEvent ?? null)
      setError('')
      if (restored) setReference(restored.payment.reference)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    try {
      if (!payment || step === 0) window.localStorage.removeItem(RESUME_KEY)
      else window.localStorage.setItem(RESUME_KEY, JSON.stringify({ version: 1, generation: historyGeneration.current,
        reference: payment.reference, step, recoveryState, creditEvent, language, assisted, expiresAt: expiresAt.current }))
      setStorageUnavailable(false)
    } catch { setStorageUnavailable(true) }
  }, [payment, step, recoveryState, creditEvent, language, assisted])

  useEffect(() => {
    if (!payment) return
    const timer = window.setTimeout(reset, Math.max(0, expiresAt.current - Date.now()))
    return () => window.clearTimeout(timer)
  }, [payment])

  useEffect(() => {
    if (error) errorRef.current?.focus()
    else {
      if (step === 0) window.scrollTo({ top: 0, behavior: 'auto' })
      else document.querySelector<HTMLElement>('[data-progress-target="steps"]')?.scrollIntoView({ block: 'start', behavior: 'auto' })
      if (payment && step === 1) resultHeadingRef.current?.focus()
      else {
        const heading = document.querySelector<HTMLElement>('main section h1, main section h2')
        if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }) }
      }
    }
  }, [error, payment, step])

  function goTo(nextStep: number, nextPayment = payment, nextRecovery = recoveryState) {
    nextStep = nextStep > 0 && nextStep < 4 ? 1 : nextStep
    setStep(nextStep)
    window.history.pushState({ version: 1, generation: historyGeneration.current, reference: nextPayment?.reference, step: nextStep, recoveryState: nextRecovery, creditEvent, expiresAt: Date.now() + 86400000 }, '', window.location.href)
  }

  function updateRecovery() {
    if (!payment || !diagnosis) return
    const observation: PaymentEvent | null = recoveryState === 'payment-reissued' ? {
      id: 'recovery-credit', stage: 'Destination bank', status: 'confirmed', source: 'Synthetic recovery simulator',
      timestamp: new Date().toISOString(), route: payment.route, rawReason: 'CREDITED', simulated: true,
      maskedReference: payment.reference, detail: 'A separate simulated bank credit confirmation was added. No real bank was contacted.',
    } : creditEvent
    const next = advanceRecovery(recoveryState, diagnosis.recoveryType, { payment, event: observation })
    setCreditEvent(observation)
    setRecoveryState(next)
    window.history.replaceState({ version: 1, generation: historyGeneration.current, reference: payment.reference, step, recoveryState: next, creditEvent: observation, expiresAt: Date.now() + 86400000 }, '', window.location.href)
    setAnnouncement(recoveryLabel(language, next))
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

  function lookup(event?: FormEvent<HTMLFormElement>, selectedReference = reference) {
    event?.preventDefault()
    setCreditEvent(null)
    expiresAt.current = Date.now() + RESUME_LIFETIME
    const result = findPaymentCase(selectedReference)
    if (!result) {
      setPayment(null)
      setError(t(language, 'unknownReference'))
      setStep(0)
      setRecoveryState('needs-correction')
      setAnnouncement(t(language, 'unknownReference'))
      return
    }
    setPayment(result)
    setReference(result.reference)
    setError('')
    const lookupUrl = new URL(window.location.href)
    lookupUrl.searchParams.delete('case')
    window.history.replaceState(null, '', lookupUrl)
    historyGeneration.current = crypto.randomUUID()
    const initialRecovery = getRecoveryStates(diagnosePayment(result).recoveryType)[0]
    setRecoveryState(initialRecovery)
    goTo(1, result, initialRecovery)
    setAnnouncement(t(language, result.events.some((item) => item.status === 'failed') ? 'whereStopped' : 'whereNow'))
  }

  function reset() {
    historyGeneration.current = crypto.randomUUID()
    setPayment(null)
    setStartPath(null)
    setAssisted(false)
    setCreditEvent(null)
    try { window.localStorage.removeItem(RESUME_KEY) } catch { setStorageUnavailable(true) }
    setError('')
    setStep(0)
    setReference('DBT-SUNITA-001')
    setRecoveryState('needs-correction')
    setAnnouncement(t(language, 'findYourPayment'))
    const clearedUrl = new URL(window.location.href)
    clearedUrl.searchParams.delete('case')
    window.history.replaceState(null, '', clearedUrl)
  }

  return <div className={`app-shell demo-shell${assisted ? ' assisted' : ''}`}>
    <a className="skip-link" href="#main-content">{say('Skip to content', 'मुख्य सामग्री पर जाएँ')}</a>
    <header className="topbar">
      <a className="brand-lockup" href="/" target={embedded ? "_top" : undefined} aria-label={say('DBT Rescue home', 'DBT रेस्क्यू मुख्य पृष्ठ')}><img className="brand-mark" src="/logo.png" alt="" width="40" height="40" /><div><strong>{t(language, 'title')}</strong><span className="demo-caption">{say('Interactive demo', 'इंटरैक्टिव डेमो')}</span></div></a>
      <div className="mobile-language"><LanguageToggle language={language} onChange={changeLanguage} /></div>
      <div className="topbar-actions">
        {!embedded && <a className="text-button frame-link" href="/frame">{say('iPhone frame', 'iPhone फ्रेम')}</a>}
        <ModeToggle language={language} assisted={assisted} onChange={toggleAssisted} />
        <button className="text-button" type="button" onClick={reset}>{t(language, 'startOver')}</button>
      </div>
      <div className="desktop-language"><LanguageToggle language={language} onChange={changeLanguage} /></div>
    </header>

    <main className="content" id="main-content">
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      <div className="demo-location"><a href="/" target={embedded ? "_top" : undefined}>{say('Product', 'प्रोडक्ट')}</a><span aria-hidden="true">/</span><span>{say('Demo workspace', 'डेमो कार्यक्षेत्र')}</span>{payment && <><span aria-hidden="true">/</span><strong>{payment.reference}</strong></>}</div>
      <PrototypeNotice language={language} />
      {payment && <p className="field-help">{storageUnavailable ? say('Device storage is unavailable. Refresh will clear this demo.', 'डिवाइस स्टोरेज उपलब्ध नहीं है। रीफ्रेश करने पर यह डेमो मिट जाएगा।') : say('Demo progress stays on this device for 24 hours. Start over clears it.', 'डेमो की प्रगति इस डिवाइस पर 24 घंटे रहती है। फिर से शुरू करने पर यह मिट जाती है।')}</p>}
      {step > 0 && <nav className="case-navigation" data-progress-target="steps" aria-label={t(language, 'recoveryTracker')}><button onClick={() => goTo(1)} aria-current={step < 4 ? 'step' : undefined}>{say('Case answer', 'मामले का उत्तर')}</button><span aria-hidden="true">→</span><span aria-current={step === 4 ? 'step' : undefined}>{say('Action packet', 'कार्रवाई पैकेट')}</span><span aria-hidden="true">→</span><span aria-current={step > 4 ? 'step' : undefined}>{say('Follow-up', 'आगे की कार्रवाई')}</span></nav>}

      {step === 0 && <section className="card hero-card" aria-labelledby="lookup-title">
        {assisted && payment && <p className="assisted-banner">{t(language, 'helperIntro', { beneficiary: payment.beneficiaryName })}</p>}
        <h1 id="lookup-title">{say('Let’s find your next step.', 'आइए अगला कदम समझें।')}</h1>
        <p className="lead">{say('Explore a fictional payment, understand a status, or find a safe place to start.', 'काल्पनिक भुगतान देखें, स्थिति समझें या शुरुआत का सुरक्षित रास्ता खोजें।')}</p>
        <div className="start-actions"><button className="primary-button" onClick={() => lookup(undefined, 'DBT-SUNITA-001')}>{say('Try a safe example', 'सुरक्षित उदाहरण देखें')} <span aria-hidden="true">→</span></button><span>{say('No sign-in. No personal information.', 'लॉगिन या निजी जानकारी की ज़रूरत नहीं।')}</span></div>
        <div className="alternative-starts">{([
          ['reference', say('Use a fictional reference', 'काल्पनिक संदर्भ इस्तेमाल करें'), say('Choose one of the demo cases', 'डेमो में से कोई मामला चुनें')],
          ['status', say('Understand a status', 'स्थिति समझें'), say('Start with what the message says', 'संदेश में बताई स्थिति से शुरू करें')],
          ['access', say('I cannot access my status', 'मेरी स्थिति उपलब्ध नहीं है'), say('Find official and assisted routes', 'आधिकारिक और सहायता के रास्ते देखें')],
        ] as const).map(([path, title, detail]) => <button key={path} aria-expanded={startPath === path} onClick={() => setStartPath(startPath === path ? null : path)}><strong>{title}<span aria-hidden="true">{startPath === path ? '−' : '+'}</span></strong><span>{detail}</span></button>)}</div>
        {startPath === 'reference' && <form className="intake-panel" onSubmit={lookup}>
          <label htmlFor="demo-case">{t(language, 'chooseFictional')}</label>
          <select id="demo-case" value={reference} onChange={(event) => setReference(event.target.value)}>
            {PAYMENT_CASES.map((demo) => { const demoCopy = getCaseCopy(demo.reference, language); return <option value={demo.reference} key={demo.reference}>{demo.reference} · {demoCopy?.benefit} · {routeLabel(demo.route, language)}</option> })}
          </select>
          <label htmlFor="reference">{t(language, 'enterReference')}</label>
          <input id="reference" name="reference" value={reference} onChange={(event) => setReference(event.target.value)} autoComplete="off" spellCheck={false} aria-invalid={Boolean(error)} aria-describedby={`reference-help${error ? ' reference-error' : ''}`} />
          <p className="field-help" id="reference-help">{t(language, 'referenceHelp')}</p>
          {error && <p className="error-message" id="reference-error" role="alert" tabIndex={-1} ref={errorRef}>{error}</p>}
          <button className="primary-button" type="submit">{t(language, 'showJourney')} <span aria-hidden="true">→</span></button>
        </form>}
        {startPath === 'status' && <div className="intake-panel"><label htmlFor="known-status">{say('What status did you see?', 'कौन सी स्थिति दिखी?')}</label><select id="known-status" value={statusRule} onChange={(event) => { setStatusRule(event.target.value); setAnnouncement(getDiagnosisCopy(event.target.value, language)?.reason ?? '') }}><option value="UNKNOWN-RAW-REASON">{say('Unknown or not listed', 'अज्ञात या सूची में नहीं')}</option><option value="DBT-ARJUN-002-RULE-1">{say('Scholarship demo · account-based · invalid IFSC', 'छात्रवृत्ति डेमो · खाता-आधारित · IFSC गलत')}</option><option value="DBT-MEENA-003-RULE-1">{say('Pension demo · Aadhaar-based · no bank mapped', 'पेंशन डेमो · आधार-आधारित · बैंक मैप नहीं है')}</option></select><p className="field-help">{say('This explains the selected message. It does not verify your payment, beneficiary or credit.', 'यह चुने हुए संदेश का अर्थ बताता है। इससे आपके भुगतान, लाभार्थी या जमा की पुष्टि नहीं होती।')}</p><h2>{statusCopy.reason}</h2><p>{statusCopy.explanation}</p><p><strong>{statusCopy.owner}</strong> — {statusCopy.action}</p><button className="secondary-button" onClick={() => window.print()}>{say('Print guidance', 'मार्गदर्शन प्रिंट करें')}</button></div>}
        {startPath === 'access' && <div className="intake-panel"><h2>{say('No status is not a diagnosis.', 'स्थिति न मिलना निदान नहीं है।')}</h2><p>{say('We cannot tell where a payment stopped without reliable observations. Start with the responsible scheme’s official support or ask a trusted helper to help you access it.', 'विश्वसनीय जानकारी के बिना हम नहीं बता सकते कि भुगतान कहाँ रुका। जिम्मेदार योजना की आधिकारिक सहायता से शुरू करें या भरोसेमंद सहायक से उसे खोलने में मदद लें।')}</p><ul className="access-links"><li><a href="https://pfms.nic.in/" target="_blank" rel="noreferrer">{say('PFMS official website — payment status entry', 'PFMS की आधिकारिक वेबसाइट — भुगतान स्थिति')} ↗</a></li><li><a href="https://dbtbharat.gov.in/" target="_blank" rel="noreferrer">{say('DBT Bharat official information', 'DBT भारत की आधिकारिक जानकारी')} ↗</a></li></ul><p className="field-help">{say('External official sites have their own coverage and access requirements. Do not share OTPs or credentials with a helper. No diagnosis is recorded here.', 'बाहरी आधिकारिक साइटों की अपनी कवरेज और पहुँच आवश्यकताएँ हैं। सहायक को OTP या लॉगिन जानकारी न दें। यहाँ कोई निदान दर्ज नहीं होता।')}</p></div>}
      </section>}

      {step === 1 && localizedPayment && localizedDiagnosis && <section className="card case-answer" aria-labelledby="journey-title">
        <div className="case-identity"><span className="case-avatar" aria-hidden="true">{payment!.beneficiaryName.split(' ').map((name) => name[0]).join('')}</span><div><strong>{localizedPayment.beneficiaryName}</strong><span>{localizedPayment.benefit} · {say('Fictional case', 'काल्पनिक मामला')}</span></div><span className="route-tag">{routeLabel(localizedPayment.route, language)}</span></div>
        {assisted && <p className="assisted-banner">{t(language, 'helperIntro', { beneficiary: localizedPayment.beneficiaryName })}</p>}
        <div className="answer-layout"><div className="answer-main"><p className="current-stage">{t(language, 'latestConfirmed')}: {localizedLatestEvent?.stage ?? t(language, 'noConfirmed')}</p><h2 id="journey-title" tabIndex={-1} ref={resultHeadingRef}>{localizedDiagnosis.reason}</h2><p className="lead">{localizedDiagnosis.explanation}</p><p className="source-note">{say('Based on simulated source observations. Conflicting reports remain in the payment trail.', 'सिम्युलेटेड स्रोत जानकारी पर आधारित। विरोधी रिपोर्ट भुगतान विवरण में बनी रहती हैं।')}</p></div><aside className="next-action" aria-label={say('Your next action', 'आपका अगला कदम')}><p>{say('Who owns the next step', 'अगले कदम की जिम्मेदारी')}</p><h3>{localizedDiagnosis.owner}</h3><p>{localizedDiagnosis.action}</p><div className="follow-up"><strong>{say('Follow-up', 'आगे की कार्रवाई')}</strong><p>{say('Ask the responsible office to acknowledge the request and provide a follow-up date. No official deadline is claimed by this demo.', 'जिम्मेदार कार्यालय से अनुरोध की पावती और अगली कार्रवाई की तारीख माँगें। यह डेमो कोई आधिकारिक समय-सीमा नहीं बताता।')}</p></div><button className="primary-button" onClick={() => goTo(4)}>{t(language, localizedDiagnosis.recoveryType === 'trace' ? 'prepareTrace' : 'prepareCorrection')} <span aria-hidden="true">→</span></button></aside></div>
        <div className="carry-row"><h3>{t(language, 'carryDocuments')}</h3><ul>{localizedDiagnosis.documents.map((document) => <li key={document}>{document}</li>)}</ul></div>
        <details className="payment-trail"><summary>{say('Payment trail', 'भुगतान का विवरण')} <span>{localizedPayment.events.length} {say('source observations', 'स्रोत घटनाएँ')}</span></summary>
        <ol className="timeline">{localizedPayment.events.map((event) => <li className="timeline-item" key={event.id}>
          <div className="timeline-marker" aria-hidden="true" /><div className="timeline-content"><div className="timeline-title-row"><h3>{event.stage}</h3><StatusPill status={event.status} language={language} /></div>
            <p>{event.detail}</p><p className="event-meta"><strong>{t(language, 'source')}:</strong> {event.source} <span aria-hidden="true">·</span> <time dateTime={event.timestamp}>{formatDate(event.timestamp, language)}</time></p><small className="simulated-label">{t(language, 'simulatedEvent')}</small>
          </div>
        </li>)}</ol></details>
        <DiagnosisAudit payment={localizedPayment} diagnosis={localizedDiagnosis} language={language} />
        <div className="button-row"><button className="secondary-button" type="button" onClick={reset}>{say('Choose another case', 'दूसरा मामला चुनें')}</button><button className="secondary-button" onClick={() => window.print()}>{say('Print case answer', 'मामले का उत्तर प्रिंट करें')}</button></div>
      </section>}

      {step === 4 && localizedPayment && localizedDiagnosis && correctionRequest && <section className="card" aria-labelledby="packet-title">
        <StepHeader step={4} payment={localizedPayment} language={language} /><div className="printable-packet"><p className="eyebrow">{t(language, correctionRequest.requestType === 'trace' ? 'fictionalTraceRequest' : 'fictionalCorrectionRequest')}</p><h2 id="packet-title">{t(language, 'packetTitle', { owner: correctionRequest.owner })}</h2><p className="muted">{t(language, 'packetLead')}</p>
          <dl className="request-details"><div><dt>{t(language, 'demoReference')}</dt><dd>{correctionRequest.reference}</dd></div><div><dt>{t(language, 'beneficiary')}</dt><dd>{correctionRequest.beneficiary}</dd></div><div><dt>{t(language, 'benefit')}</dt><dd>{correctionRequest.scheme}</dd></div><div><dt>{t(language, 'accountShown')}</dt><dd>{correctionRequest.account}</dd></div>{localizedLatestEvent && <div><dt>{t(language, 'source')}</dt><dd>{localizedLatestEvent.source} · <time dateTime={localizedLatestEvent.timestamp}>{formatDate(localizedLatestEvent.timestamp, language)}</time></dd></div>}</dl>
          <div className="request-action"><p className="eyebrow">{t(language, 'askAction')}</p><p>{correctionRequest.action}</p></div><p className="eyebrow">{t(language, 'carry')}</p><ul className="check-list">{correctionRequest.documents.map((document) => <li key={document}>{document}</li>)}</ul>
        </div><div className="button-row"><button className="secondary-button" type="button" onClick={() => goTo(3)}>{t(language, 'back')}</button><button className="secondary-button" type="button" onClick={() => window.print()}>{t(language, 'printRequest')}</button><button className="primary-button" type="button" onClick={() => { const acknowledged = recoveryState === recoveryStates[0] ? recoveryStates[1] : recoveryState; setRecoveryState(acknowledged); goTo(5, payment, acknowledged); setAnnouncement(t(language, 'fictionalAcknowledgement')) }}>{t(language, 'recordAcknowledgement')} <span aria-hidden="true">→</span></button></div>
      </section>}

      {step === 5 && localizedPayment && localizedDiagnosis && <section className="card" aria-labelledby="acknowledgement-title">
        <StepHeader step={5} payment={localizedPayment} language={language} /><p className="eyebrow">{t(language, 'fictionalAcknowledgement')}</p><h2 id="acknowledgement-title">{t(language, 'recorded', { request: t(language, localizedDiagnosis.recoveryType === 'trace' ? 'traceRequest' : 'correctionRequest') })}</h2><p className="lead">{t(language, 'acknowledgementLead')}</p>
        <div className="acknowledgement-card"><strong>{localizedPayment.reference}</strong><span>{localizedDiagnosis.recoveryType === 'trace' ? t(language, 'bankTraceSubmitted') : t(language, 'correctionSubmitted', { owner: localizedDiagnosis.owner })}</span><small>{t(language, 'ackReference', { reference: localizedPayment.reference.slice(-3) })}</small></div>
        <div className="button-row"><button className="secondary-button" type="button" onClick={() => goTo(4)}>{t(language, 'back')}</button><button className="primary-button" type="button" onClick={() => { goTo(6); setAnnouncement(t(language, 'trackRecovery')) }}>{t(language, 'trackRecovery')} <span aria-hidden="true">→</span></button></div>
      </section>}

      {step === 6 && localizedPayment && localizedDiagnosis && <section className="card" aria-labelledby="recovery-title">
        <StepHeader step={6} payment={localizedPayment} language={language} /><p className="eyebrow">{t(language, 'simulatedTracker')}</p><h2 id="recovery-title">{t(language, 'trackerTitle')}</h2><p className="lead">{t(language, 'trackerLead')}</p>
        <ol className="recovery-list">{recoveryStates.map((state) => { const currentIndex = recoveryStates.indexOf(recoveryState); const stateIndex = recoveryStates.indexOf(state); return <li className={stateIndex <= currentIndex ? 'recovery-item reached' : 'recovery-item'} key={state}><span className="recovery-dot" aria-hidden="true">{stateIndex <= currentIndex ? '✓' : stateIndex + 1}</span><span>{recoveryLabel(language, state)}</span></li> })}</ol>
        {recoveryState !== recoveryStates[recoveryStates.length - 1] ? <button className="primary-button" type="button" onClick={updateRecovery}>{recoveryState === 'payment-reissued' ? say('Add simulated bank credit confirmation', 'सिम्युलेटेड बैंक जमा पुष्टि जोड़ें') : t(language, 'showNext')} <span aria-hidden="true">→</span></button> : <div className="success-message" role="status"><strong>{t(language, 'finalState', { state: recoveryLabel(language, recoveryState) })}</strong></div>}
        {creditEvent && <aside className="technical-details"><strong>{say('Separate simulated credit evidence', 'अलग सिम्युलेटेड जमा प्रमाण')}</strong><p>{say('Synthetic recovery simulator · Destination bank · Confirmed. No real bank was contacted.', 'सिंथेटिक रिकवरी सिम्युलेटर · गंतव्य बैंक · पुष्टि की गई। किसी वास्तविक बैंक से संपर्क नहीं किया गया।')}</p><p>{creditEvent.maskedReference} · <time dateTime={creditEvent.timestamp}>{formatDate(creditEvent.timestamp, language)}</time></p><code>{creditEvent.id} · {creditEvent.rawReason}</code></aside>}
        <div className="button-row"><button className="secondary-button" type="button" onClick={() => goTo(4)}>{t(language, 'viewRequest')}</button><button className="text-button" type="button" onClick={reset}>{t(language, 'startAnother')}</button></div>
      </section>}
    </main>
    <footer className="site-footer" aria-label={t(language, 'footerLabel')}>
      <details className="disclosure"><summary>{t(language, 'disclosureTitle')}</summary><p>{t(language, 'disclosureBody')}</p><p><a href="https://github.com/aakashpawar1999/dbt-rescue/blob/main/docs/functional-vs-simulated.md" target="_blank" rel="noreferrer">{t(language, 'functionalDisclosure')}</a> · <a href="https://github.com/aakashpawar1999/dbt-rescue/blob/main/docs/known-limitations.md" target="_blank" rel="noreferrer">{t(language, 'knownLimitations')}</a></p></details>
      <p><strong>{t(language, 'hackathonProject')}</strong></p>
      <p>{t(language, 'footerDisclosure')}</p>
      <p>{t(language, 'footerSafety')}</p>
    </footer>
  </div>
}
