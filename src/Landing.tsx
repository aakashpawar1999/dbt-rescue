import { PAYMENT_CASES } from './domain/cases'
import { diagnosePayment } from './domain/rules'

const repo = 'https://github.com/aakashpawar1999/dbt-rescue'

export default function Landing() {
  return <div className="landing">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="landing-nav page-width">
      <a className="landing-brand" href="/" aria-label="DBT Rescue home"><img src="/logo.png" alt="" width="40" height="40" /><span>DBT Rescue<span className="brand-subline">Paisa kahan atka?</span></span></a>
      <nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#coverage">The cases</a><a href="/frame">iPhone frame</a></nav>
      <a className="button-dark" href="/demo">Explore the demo <span aria-hidden="true">↗</span></a>
    </header>
    <main id="main-content">
      <section className="landing-hero">
        <div className="page-width hero-layout">
          <div className="hero-story">
            <p className="release-label"><span aria-hidden="true" /> A clearer path through DBT payments</p>
            <h1>A payment status should come with a next step.</h1>
            <p className="hero-description">Where did it stop? Who can help? What should you take? DBT Rescue brings the answers together, so a confusing benefit payment becomes a clear plan.</p>
            <div className="hero-actions"><a className="button-light" href="/demo">Try a fictional case <span aria-hidden="true">→</span></a><a className="hero-secondary" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a></div>
            <p className="hero-boundary">Synthetic demonstration · No personal details needed<br />Independent project. Not a government service.</p>
          </div>
          <div className="hero-example" aria-label="Illustrative scholarship case and its next action">
            <div className="example-top"><span>Inside a recovery journey</span><span className="example-badge">Fictional case</span></div>
            <div className="example-person"><span className="person-avatar" aria-hidden="true">AS</span><div><strong>Arjun’s scholarship</strong><span>Account-based payment · DBT-ARJUN-002</span></div></div>
            <ol className="example-rail"><li><span aria-hidden="true">✓</span>Scheme approved</li><li><span aria-hidden="true">✓</span>Payment validated</li><li className="example-failed"><span aria-hidden="true">!</span>Bank returned</li></ol>
            <div className="example-answer"><span className="answer-label">The reason</span><h2>The branch code needs a correction.</h2><p>The IFSC in the scheme record is invalid. The scholarship department owns the next step.</p></div>
            <div className="example-next"><span aria-hidden="true">↗</span><div><strong>A specific action, for the right owner.</strong><p>Confirm the current IFSC with the bank, then ask the scheme department to update its record.</p></div></div>
            <div className="example-bottom"><span>Source-backed rules</span><span>English + हिन्दी</span></div>
          </div>
        </div>
      </section>
      <div className="promise-strip page-width"><p>From an unclear status<br /><strong>to an understandable action.</strong></p><span>Find the point of failure</span><span>Know who owns the next step</span><span>Keep the evidence together</span></div>
      <section className="how-section page-width" id="how-it-works" aria-labelledby="how-title">
        <div className="section-intro"><h2 id="how-title">Less running around.<br />More knowing what to do.</h2><p>A payment can pass through a scheme office, a payment system and more than one bank. The demo keeps that trail visible while putting the useful answer first.</p></div>
        <ol className="how-steps">
          <li><span className="step-index">1</span><div><h3>Start with a safe example</h3><p>Explore a fictional payment. Each case has its own route, source observations and reason for needing help.</p></div></li>
          <li><span className="step-index">2</span><div><h3>Understand the next action</h3><p>See the explanation, responsible organisation and documents to carry. Inspect the exact rule and source when you need the detail.</p></div></li>
          <li><span className="step-index">3</span><div><h3>Follow the recovery journey</h3><p>Prepare a printable packet and follow simulated acknowledgement and recovery steps. A correction and a confirmed credit remain different events.</p></div></li>
        </ol>
      </section>
      <section className="coverage-section" id="coverage" aria-labelledby="coverage-title"><div className="page-width">
        <div className="section-intro"><div><p className="section-note">Different reasons. Different next steps.</p><h2 id="coverage-title">Look past “payment failed.”</h2></div><p>Explore the current fictional examples. They demonstrate bounded scenarios, not live payment status or exhaustive scheme coverage.</p></div>
        <div className="case-inventory">{PAYMENT_CASES.map((payment) => <a href={`/demo?case=${payment.reference}`} className="case-row" key={payment.reference}><span className="case-person"><strong>{payment.beneficiaryName}</strong><span>{payment.benefit}</span></span><span className="case-reason">{diagnosePayment(payment).reason}</span><span className="case-open">Open case <span aria-hidden="true">↗</span></span></a>)}</div>
        <p className="inventory-note">All people, references, payment events and outcomes shown are fictional or simulated.</p>
      </div></section>
      <section className="trust-section page-width" id="trust" aria-labelledby="trust-title">
        <div className="trust-statement"><span className="trust-mark" aria-hidden="true">↳</span><h2 id="trust-title">Trust comes from showing our working.</h2><p>No guessed success. No hidden source trail. No request for your Aadhaar, bank credentials or OTP.</p><a className="text-link" href={`${repo}/blob/main/docs/functional-vs-simulated.md`}>What works and what is simulated <span aria-hidden="true">↗</span></a></div>
        <div className="trust-details"><article><h3>Rules before recommendations</h3><p>Explanations come from deterministic rules with source provenance. Unsupported observations keep their uncertainty.</p></article><article><h3>Built for understanding</h3><p>English and Hindi, assisted use, keyboard navigation and printable instructions support the person taking the next step.</p></article><article><h3>Clear about the boundary</h3><p>This is an independent synthetic demonstration. It cannot verify your payment, decide eligibility, correct official records or release money.</p></article></div>
      </section>
      <section className="landing-faq page-width" aria-labelledby="faq-title"><h2 id="faq-title">Before you try it.</h2><div>
        <details><summary>Can I check my own payment?</summary><p>No. The public demo uses fictional cases only. Do not enter real identifiers or banking information. Use the responsible scheme or bank’s official channels for your own payment.</p></details>
        <details><summary>Is this connected to the government or my bank?</summary><p>No. All integrations and payment outcomes are simulated. DBT Rescue has no government affiliation or endorsement.</p></details>
        <details><summary>Does fixing a detail mean the money will arrive?</summary><p>No. Correction, payment reprocessing and destination credit are separate steps. A correction does not guarantee approval or payment.</p></details>
        <details><summary>Where can I inspect the project?</summary><p>The <a href={repo}>source repository</a> includes the <a href={`${repo}/blob/main/docs/architecture.md`}>architecture</a>, <a href={`${repo}/blob/main/docs/privacy-security.md`}>privacy and security notes</a>, and <a href={`${repo}/blob/main/docs/known-limitations.md`}>known limitations</a>.</p></details>
      </div></section>
      <section className="landing-cta"><div className="page-width"><h2>See what a clearer<br />next step feels like.</h2><div><a className="button-dark" href="/demo">Open the full demo <span aria-hidden="true">↗</span></a><p>Fictional cases. Real working interactions.</p></div></div></section>
    </main>
    <footer className="landing-footer page-width"><a className="landing-brand" href="/"><img src="/logo.png" alt="" width="36" height="36" /><span>DBT Rescue</span></a><p>An independent project built with Codex.<br />Originated at Build What Moves India.</p><nav aria-label="Project resources"><a href={repo}>Build ↗</a><a href={`${repo}/blob/main/docs/rules-inventory.md`}>Evidence ↗</a><a href={`${repo}/blob/main/docs/privacy-security.md`}>Privacy ↗</a></nav></footer>
  </div>
}
