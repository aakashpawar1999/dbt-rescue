# Paisa Kahan Atka? — DBT Rescue

An independent hackathon prototype that helps a citizen understand where a
fictional government benefit payment stopped, why it failed, who can fix it, and
how to follow simulated recovery.

## Current release

Version 1.1.0 is the redesigned synthetic demo with a simplified presentation
toolbar. The product landing page is at
<https://dbt-rescue.aakashpawar1999.chatgpt.site/>; the full interactive demo is at
<https://dbt-rescue.aakashpawar1999.chatgpt.site/demo>.

GitHub Actions verifies feature and promotion PRs and publishes tagged GitHub
Releases. The existing ChatGPT Sites project hosts the public app. Site version
numbers are independent of package versions; deployment evidence records the
exact source and rollback target. See [release notes](docs/releases/v1.1.0.md).

## Safe demo

Use only these fictional references: `DBT-SUNITA-001` (Aadhaar-based farmer
benefit), `DBT-ARJUN-002` (account-based scholarship), and `DBT-MEENA-003`
(Aadhaar-based pension). Never enter a real Aadhaar number, bank-account
number, OTP, government login, or personal information. This prototype has no
live government, banking, identity, analytics, or model API requests.

## Local development

Requires Bun and Node.js 24 LTS.

```sh
bun install
bun run dev
```

Checks and production build:

```sh
bun run test
bun run lint
bun run build
```

`bun run test` builds first and then runs the deterministic Vitest suite. The
production build emits the browser client and the Cloudflare Workers-compatible
Site entrypoint required by ChatGPT Sites.

## Hosted demo

The app uses local fictional fixtures, deterministic rules, browser state, and
browser-native printing. Printing the correction request uses the browser's
print dialog; no document is uploaded anywhere.

## What is currently built

- A professional product landing page and separate `/demo` workspace.
- An interactive `/frame` Mobile frame studio for screen recordings, with fit,
  zoom, reload and hidden controls. It does not record video itself.
- Four safe starts: safe example, fictional reference, a supported status, or
  guidance when status cannot be accessed.
- A combined case answer with owner, next action, evidence and follow-up guidance.
- Fixed 24-hour device-local resume, with schema validation and explicit reset.
- A separate simulated bank-credit observation before recovery shows credit.

- Three safe fictional references: `DBT-SUNITA-001`, `DBT-ARJUN-002`, and
  `DBT-MEENA-003`.
- Aadhaar-based and account-based payment journeys with source-labelled,
  timestamped, missing, failed, confirmed, and conflicting events.
- Deterministic reviewed diagnoses for mapped-bank success, invalid IFSC, and
  unavailable Aadhaar mapping, plus a safe unknown-reason fallback.
- A provenance view showing the matched event, raw reason, rule ID and version,
  source, route, review date, and reviewer status.
- Responsible-owner guidance, next action, document checklist, and a masked
  browser-printable trace or correction request.
- Simulated acknowledgement and recovery tracking. The trace journey has three
  local states; correction journeys have five local states.
- English, Hinglish, Hindi, Marathi, Tamil, Telugu and Bengali switching in a compact dropdown,
  Assisted Mode/Citizen Mode, Reset Demo and browser Back behavior, keyboard-visible focus, live
  announcements, narrow-phone layout, and print styles.

## Product boundary

The current journey includes seven demo languages, state-preserving
language switching, presentation-only Assisted Mode/Citizen Mode in the options menu,
accessible focus and live status announcements, absolute timestamps, low-data
system-font presentation, and bilingual browser-printable packets. The three
fictional journeys cover Aadhaar-based and account-based routes: a mapped-bank
success, an invalid-IFSC correction, and an unavailable Aadhaar mapping.

The app is not an official government service and does not determine
eligibility, correct real records, or release money. All government, PFMS,
NPCI, Aadhaar, bank, acknowledgement, reissue, and credit behavior is
simulated in the browser using local fixtures.

## Accessibility and language review

Use the language dropdown before lookup or at any later step. Use More options → Assisted Mode
when a helper is explaining a fictional beneficiary's case; choose Citizen Mode to return to a
citizen-first presentation. The release uses semantic landmarks,
labelled controls, visible focus, live status announcements, text plus icons,
system fonts, 44-pixel controls, and browser-native printing.

The manual test record is in
[docs/accessibility-checklist.md](docs/accessibility-checklist.md). Final Hindi
terminology and screen-reader review remain human approval gates before any
live-service or official-service claim.

## 0.4.0 audit and production boundary

The audit view connects each supported diagnosis to its fictional source event,
versioned rule, source URL, review date, and reviewer status. The production
documents are proposals only; they do not add live integrations or make the
prototype an official service.

## Publishing

The Site project ID is stored in `.openai/hosting.json`. For the repeatable
publish checklist, public-access verification, and the boundary between GitHub
CI and Sites publishing, see [docs/sites-publishing.md](docs/sites-publishing.md).

The short version is: validate the exact source, push it to the existing Site
source repository, package the successful build, save one Site version, deploy
that saved version, and verify the public URL. Do not create a second Site or
restore GitHub Pages. Sites publishing currently requires the Sites/Codex
workflow; GitHub Actions does not contain a long-lived Site credential.

Reviewer evidence:

- [functional-versus-simulated disclosure](docs/functional-vs-simulated.md)
- [known limitations](docs/known-limitations.md)
- [rule provenance](docs/rules-inventory.md)
- [architecture](docs/architecture.md)
- [privacy and security](docs/privacy-security.md)
- [operating model](docs/operating-model.md)
- [Codex contribution log](docs/codex-contribution-log.md)
- [licence inventory](docs/dependencies-and-assets.md)

Historical release notes remain under [docs/releases](docs/releases), and the
repository-wide change record is [CHANGELOG.md](CHANGELOG.md).

The added Hinglish, Marathi, Tamil, Telugu and Bengali catalogues cover demo instructions, case details and printable packets. Automated checks preserve references and technical codes; formal native-speaker review is not claimed. Landing and studio controls remain English.
