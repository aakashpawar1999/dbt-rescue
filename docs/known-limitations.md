# Known limitations and release boundary

## Functional in this release

- Three synthetic cases cover one farmer-benefit mapped-account trace, one
  account-based scholarship IFSC correction, and one Aadhaar-mapping failure.
- The local interface renders source-labelled events, deterministic reviewed
  rules, a provenance audit, masked packets, and simulated recovery state.
- Repository tests check rule coverage, fallback behavior, masking boundaries,
  forbidden endpoints, and documentation links.

## Not functional in this release

- No live scheme, PFMS, NPCI, Aadhaar, bank, identity, grievance, notification,
  consent, audit, or payment-reprocessing integration exists.
- No person is authenticated and no real benefit is approved, corrected, issued,
  or credited.
- The production architecture, privacy controls, operating model, and event
  contract are proposals, not an implementation or an approval by any actor.

## Known risks

| Risk | Boundary or mitigation |
|---|---|
| Synthetic data is mistaken for live status | Prototype and simulated labels remain visible; references are fictional |
| Three cases do not cover every scheme or return reason | Additional rules stay out of scope until separately sourced and reviewed |
| Public guidance changes | Rule owner records source and review date and withdraws stale rules |
| Organisations have different governance | Production rollout requires actor-specific approvals and data-sharing agreements |
| A correction is mistaken for recovery | The event contract keeps correction, retry, and credit separate |

Finalist, deployment, legal, security-certification, and regulator requirements
remain unresolved and are not implied by this release.
