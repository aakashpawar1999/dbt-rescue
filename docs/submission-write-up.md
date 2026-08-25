# Paisa Kahan Atka? — DBT Rescue

## Problem

When a government benefit payment fails or appears successful in one system but
not in the account a citizen checks, the citizen must connect information across
the scheme department, PFMS, payment network, mapper, bank, and grievance
channels. The status may name a technical reason without saying who owns the
next fix, what evidence to carry, or whether a grievance is appropriate.

Sunita is a fictional farmer-benefit recipient. Her demo record shows a newer
mapped Bank B credit and an older Bank A check, so the product preserves the
conflict and routes her to a trace rather than declaring that money is missing.

## Solution

DBT Rescue is a cross-scheme failure-diagnosis and recovery layer. It turns
source-labelled events into one plain-language answer: where the payment
stopped, why, who can act, what documents are needed, what evidence was
recorded, and what simulated state comes next.

The focused journey is:

1. Look up one of three fictional references.
2. Read the department-to-bank timeline with source and timestamp.
3. See a deterministic, reviewed explanation and its provenance.
4. Follow the responsible owner and prepare a masked trace or correction packet.
5. Record a fictional acknowledgement and advance the local recovery tracker.

## Why this is more than a redesign

PFMS provides payment status and rejection remedies. NPCI and BASE-related
services address payment routing and Aadhaar–bank mapping. State and scheme
systems may explain failures, accept corrections, or handle grievances.
CPGRAMS provides a grievance route. DBT Rescue does not replace those systems
or claim their features are absent. Its proposed distinction is orchestration:
one consistent case trail across actors, with responsible-owner routing and
evidence continuity, including cases where a grievance is not the first action.

## What works

- Three fictional cases cover farmer-benefit, scholarship, and pension journeys.
- Aadhaar-based and account-based routes are represented.
- Deterministic rules map supported failure reasons to explanation, owner,
  action, documents, and next state.
- Source, timestamp, missing, and conflicting event details remain visible.
- Rule provenance and an unknown-reason safe fallback are available.
- English and Hindi, assisted mode, keyboard semantics, visible focus, small
  viewport layout, and browser printing are implemented locally.
- The default public walkthrough starts with `DBT-SUNITA-001`.

## What is simulated or proposed

All government, PFMS, NPCI, Aadhaar, bank, identity, grievance, acknowledgement,
reissue, and credit behavior is simulated with fictional fixtures. The product
does not determine eligibility, change a real record, file a real grievance,
release money, or confirm a real bank credit. The production architecture,
privacy controls, operating model, and status contract are proposals requiring
participating-organisation approval.

## Safety, accessibility, and evidence

The app accepts only documented fictional references and warns against real
personal or financial information. It uses no live API, model call, analytics,
remote font, or third-party runtime asset. The repository records tests,
production build checks, accessibility review, source-backed rule provenance,
licence inventory, known limitations, and Codex work:

- [Functional versus simulated](functional-vs-simulated.md)
- [Known limitations](known-limitations.md)
- [Accessibility checklist](accessibility-checklist.md)
- [Rule inventory](rules-inventory.md)
- [Architecture and production boundary](architecture.md)
- [Privacy and security](privacy-security.md)
- [Codex contribution log](codex-contribution-log.md)
- [Dependencies and licences](dependencies-and-assets.md)

## Codex contribution

Codex helped translate official DBT/PFMS/NPCI research into deterministic
synthetic fixtures and reviewed rules; implement the React/Vite journey; write
failing-first tests; verify mobile, keyboard, language, print, safety, and build
behavior; debug release and CI issues; and produce the evidence and submission
documents. The runtime diagnosis is deterministic and does not use an AI
chatbot or model-generated banking remedy.

## Links and release identity

These are the public links for the transcript-only release package. The
manifest records the verification status; the organiser submission destination
remains unknown in the local research snapshot.

- Demo: <https://dbt-rescue.aakashpawar1999.chatgpt.site/>
- Repository: <https://github.com/aakashpawar1999/dbt-rescue>
- Release: <https://github.com/aakashpawar1999/dbt-rescue/releases/tag/v0.5.0>
- Transcript: <https://github.com/aakashpawar1999/dbt-rescue/blob/main/docs/demo-transcript.md>
- Submission destination: not published in the local research snapshot.
