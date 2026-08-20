# Proposed privacy and security model

This document describes controls a real authorised service would need. None of
these controls turns the local prototype into a live identity, bank, or
government service.

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
