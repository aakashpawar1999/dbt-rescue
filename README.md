# Paisa Kahan Atka? — DBT Rescue

An independent hackathon prototype that helps a citizen understand where a
fictional government benefit payment stopped, why it failed, who can fix it, and
how to follow simulated recovery.

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

The app uses local fictional fixtures, deterministic rules, browser state, and
browser-native printing. Printing the correction request uses the browser's
print dialog; no document is uploaded anywhere.

## Scope

The 0.3.0 release adds reviewed English and Hindi copy, a language switch that
preserves the journey, assisted mode for a family member or service-centre
helper, accessible focus and live status announcements, absolute timestamps,
low-data system-font presentation, and bilingual browser-printable packets.
The three fictional journeys remain available across Aadhaar-based and
account-based routes: a mapped-account success, an invalid-IFSC correction,
and an unavailable Aadhaar mapping.

The app is not an official government service and does not determine
eligibility, correct real records, or release money. All government, PFMS,
NPCI, Aadhaar, bank, acknowledgement, reissue, and credit behavior is
simulated locally.

## Accessibility and language review

Use the language buttons before lookup or at any later step. Use assisted mode
when a helper is explaining a fictional beneficiary's case; the mode keeps the
beneficiary and helper roles explicit. The release uses semantic landmarks,
labelled controls, visible focus, live status announcements, text plus icons,
system fonts, 44-pixel controls, and browser-native printing.

The manual test record is in
[docs/accessibility-checklist.md](docs/accessibility-checklist.md). Final Hindi
terminology and screen-reader review remain human approval gates before any
real deployment or official-service claim.

See [functional-versus-simulated disclosure](docs/functional-vs-simulated.md)
and the [dependency and asset inventory](docs/dependencies-and-assets.md).
