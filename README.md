# Paisa Kahan Atka? — DBT Rescue

An independent hackathon prototype that helps a citizen understand where a
fictional government benefit payment stopped, why it failed, who can fix it, and
how to follow simulated recovery.

## Current status

- The public build is hosted on ChatGPT Sites at
  <https://dbt-rescue.aakashpawar1999.chatgpt.site/>.
- The Site is public and opens without a ChatGPT login. The root document and
  its referenced JavaScript and CSS assets were verified from the public URL on
  28 August 2026.
- The Site version and hosted source commit are managed separately from the
  package version and recorded with each production deployment.
- The shorter hostname `https://dbt-rescue.chatgpt.site/` is not assigned by
  Sites. The current account-scoped hostname above is the working public URL.
- GitHub Pages publishing has been removed. GitHub Actions now verifies the
  application and creates GitHub Releases; ChatGPT Sites is the production host.
- The `feat/0.6.4` branch carries the next package version, while the current
  GitHub release remains `0.6.3`. The public Site version and hosted source are
  recorded separately because Site versioning is managed by the Sites project.

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
- English/Hindi switching with responsive top-right header placement, assisted
  mode, reset and browser Back behavior, keyboard-visible focus, live
  announcements, narrow-phone layout, and print styles.

## Product boundary

The current journey includes reviewed English and Hindi copy, state-preserving
language switching, assisted mode for a family member or service-centre helper,
accessible focus and live status announcements, absolute timestamps, low-data
system-font presentation, and bilingual browser-printable packets. The three
fictional journeys cover Aadhaar-based and account-based routes: a mapped-bank
success, an invalid-IFSC correction, and an unavailable Aadhaar mapping.

The app is not an official government service and does not determine
eligibility, correct real records, or release money. All government, PFMS,
NPCI, Aadhaar, bank, acknowledgement, reissue, and credit behavior is
simulated in the browser using local fixtures.

## Accessibility and language review

Use the language buttons before lookup or at any later step. Use assisted mode
when a helper is explaining a fictional beneficiary's case; the mode keeps the
beneficiary and helper roles explicit. The release uses semantic landmarks,
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
