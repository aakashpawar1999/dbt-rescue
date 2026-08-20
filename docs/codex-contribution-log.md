# Codex contribution log

This log records concrete work completed with Codex during the `0.2.0`,
`0.3.0`, and `0.4.0` releases. Each entry names the work and resulting
artifact; it is not an author or attribution line.

| Area | Contribution |
|---|---|
| Research translation | Converted the approved DBT/PFMS/NPCI brief into a small fictional payment fixture and a deterministic owner/action rule. |
| Implementation | Built the React, TypeScript, Vite, Tailwind, local-fixture, seven-step recovery prototype. |
| Testing | Used failing-first Vitest checks for the payment fixture, diagnosis rule, recovery state machine, and safe entry view. |
| Accessibility | Reviewed semantic landmarks, labels, headings, live status regions, keyboard focus, non-colour status, and the 360 px layout in the local browser. |
| Debugging | Found and fixed the missing Vite module entry in `index.html` after the first build produced only the HTML shell. |
| Documentation | Wrote the functional-versus-simulated boundary, safe demo instructions, dependency/licence inventory, and release checks. |
| Domain extension | Added three synthetic cross-scheme fixtures, Aadhaar/account route metadata, source reconciliation, and reviewed owner/action rules. |
| Recovery | Added scenario-specific trace and correction sequences with masked printable requests. |
| UI and accessibility | Added native case selection, route/status text, reset-safe state, focus movement, and 360 px browser verification. |
| Bun migration | Replaced npm installation and CI commands with Bun and committed the Bun lockfile. |

## 0.4.0 contributions

| Area | Work performed and resulting artifact |
|---|---|
| Provenance | Added versioned rule identifiers, source URLs, scheme/route scope, matched-event metadata, review status, and safe unknown-reason fallback in `src/domain/rules.ts`. |
| Audit UI | Added the progressive `How this diagnosis was decided` view with bilingual labels and a 360px-safe layout in `src/App.tsx`, `src/i18n.ts`, and `src/styles.css`. |
| Test creation | Added exact provenance, unknown-rule, fixture-coverage, masking, source-allowlist, and package-version checks in `src/domain/rules.test.ts` and `src/release-safety.test.ts`. |
| Architecture | Wrote the proposed event path, status-and-resolution contract, actor responsibilities, privacy controls, and failure matrix in `docs/architecture.md`, `docs/status-resolution-contract.md`, `docs/operating-model.md`, `docs/privacy-security.md`, and `docs/failure-modes.md`. |
| Safety and limitations | Updated `docs/functional-vs-simulated.md` and `docs/known-limitations.md` to separate functional prototype behavior from proposed production behavior. |
| Licence evidence | Updated `docs/dependencies-and-assets.md` with package sources, versions, licences, synthetic dataset status, and 0.4.0 additions. |
| Debugging and verification | Fixed the provenance type contract and verified the red-to-green tests, 360px browser audit flow, lint, test, and production build. |

The runtime does not use an AI chatbot or model-generated banking remedy. The
diagnosis remains deterministic and testable.

## 0.3.0 contributions

| Area | Contribution |
|---|---|
| Bilingual copy | Added local English/Hindi dictionaries for all primary journey, case, diagnosis, event, recovery, safety, and print strings with parity tests. |
| Assisted journey | Added a state-preserving helper mode that names the fictional beneficiary and keeps direct citizen wording distinct. |
| Accessibility | Added language controls, semantic landmarks, programmatic labels, visible focus, live status announcements, absolute timestamps, and text-backed status meaning. |
| Low-data UI | Kept the build local-only with system fonts and no remote media, analytics, or runtime translation service. |
| Print | Added bilingual packet context with source/timestamp evidence and print CSS that removes navigation and interactive controls. |
| Verification | Ran 360-pixel browser checks for English/Hindi, all three synthetic journeys, browser-back state, masked packet output, and simulated recovery announcements. |
