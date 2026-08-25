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

## Hosting and release limitations

- The public Site uses the account-scoped URL
  <https://dbt-rescue.aakashpawar1999.chatgpt.site/>. The shorter
  `dbt-rescue.chatgpt.site` hostname is not assigned by Sites.
- The Site is public and requires no ChatGPT login, so the repository must
  continue to contain synthetic, masked, non-sensitive data only.
- GitHub Actions verifies the build and tagged GitHub Releases but does not
  publish to ChatGPT Sites. Site version saving and deployment currently use
  the Sites/Codex workflow with a short-lived credential; no long-lived Site
  credential is stored in GitHub.
- The hosted Site can move ahead of the immutable `v0.5.0` tag for hosting or
  documentation fixes. The tag is not rewritten to make those changes appear
  part of the historical release.

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
