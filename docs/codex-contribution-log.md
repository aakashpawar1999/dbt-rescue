# Codex contribution log

This log records concrete work completed with Codex during the `0.1.0` release.

| Area | Contribution |
|---|---|
| Research translation | Converted the approved DBT/PFMS/NPCI brief into a small fictional payment fixture and a deterministic owner/action rule. |
| Implementation | Built the React, TypeScript, Vite, Tailwind, local-fixture, seven-step recovery prototype. |
| Testing | Used failing-first Vitest checks for the payment fixture, diagnosis rule, recovery state machine, and safe entry view. |
| Accessibility | Reviewed semantic landmarks, labels, headings, live status regions, keyboard focus, non-colour status, and the 360 px layout in the local browser. |
| Debugging | Found and fixed the missing Vite module entry in `index.html` after the first build produced only the HTML shell. |
| Documentation | Wrote the functional-versus-simulated boundary, safe demo instructions, dependency/licence inventory, and release checks. |

The runtime does not use an AI chatbot or model-generated banking remedy. The
diagnosis remains deterministic and testable.
