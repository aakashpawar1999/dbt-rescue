# Codex contribution log

This log records concrete work completed with Codex during the `0.2.0` release.

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

The runtime does not use an AI chatbot or model-generated banking remedy. The
diagnosis remains deterministic and testable.
