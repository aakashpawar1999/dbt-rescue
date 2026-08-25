# Proposed privacy and security model

This document describes controls a real authorised service would need. None of
these controls turns the local prototype into a live identity, bank, or
government service.

## Controls implemented in the prototype

- All fixtures are fictional and repository-authored; displayed account values
  are masked.
- The app has no login, password, OTP, Aadhaar, unrestricted account, upload,
  analytics, model, or external service flow.
- State stays in the browser during the journey. The print action opens the
  browser's print dialog and does not upload a document.
- The public Site contains no secret or real personal data. Site publishing
  uses a short-lived source credential outside the repository and does not put
  that credential in the browser bundle.

These controls make the public demo safer; they are not a production security
assessment or a substitute for the controls below.

## Data minimisation

- Accept a scheme-provided case reference or short-lived lookup token, not a
  full Aadhaar number, OTP, password, or unrestricted bank account number.
- Store only the masked account context, payment route, source events, owner
  handoffs, correction proof metadata, and consent needed for the case trail.
- Keep document contents with the responsible organisation where possible;
  store only a type, hash, timestamp, and destination reference in this layer.
- Use fictional identifiers and browser-held state in the prototype.

## Controls required before production

| Area | Proposed control | Owner |
|---|---|---|
| Transit | TLS with managed certificate and authenticated service-to-service calls | Platform security |
| Storage | Encryption at rest with managed key rotation and separated secrets | Platform security |
| Access | Least privilege, organisation-scoped roles, break-glass logging, and periodic review | Product operations |
| Consent | Purpose, source, destination, expiry, withdrawal, and assisted-user record | Participating organisations |
| Audit | Append-only access and event trail with correlation and idempotency identifiers | Product operations |
| Retention | Written schedule per actor; delete or anonymise after the approved purpose ends | Data governance |
| Incident handling | Detection, containment, notification, evidence preservation, and recovery runbook | Security and service owners |

No full Aadhaar display is permitted. Masking is not a substitute for access
control, encryption, consent, or an approved data-sharing agreement.

## Open approvals

The identity and consent pattern, retention period, data processor roles,
incident notification route, and security certification remain unresolved until
participating organisations approve them.
