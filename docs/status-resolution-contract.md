# Proposed status-and-resolution contract

This is a proposed inter-organisation shape. It is not an API implemented by
the prototype and requires participating organisations to approve field
semantics, identity, consent, and retention.

```yaml
event_id: source-owned-string
case_reference: masked-or-short-lived-reference
stage: scheme | pfms | sponsor-bank | payment-rail | destination-bank | grievance
status: received | validated | submitted | failed | returned | missing | conflict | credited
source:
  organisation: source-owner
  system: source-system
  event_id: source-event-id
  observed_at: 2026-08-20T09:12:00+05:30
  received_at: 2026-08-20T09:12:03+05:30
timestamp: 2026-08-20T09:12:00+05:30
route: aadhaar | account
responsible_owner: organisation-or-queue
reason: source-raw-reason
next_action: reviewed-action-or-safe-unknown-guidance
correction_proof:
  type: document-or-acknowledgement
  reference: organisation-owned-reference
  received_at: timestamp
next_payment_event: source-event-id-or-null
rule:
  id: stable-rule-id-or-unknown
  version: semver
  reviewer_status: human-reviewed | unreviewed | withdrawn
```

## Invariants

- `source` and `timestamp` are required for every event; unavailable sources
  create an unavailable state rather than a success.
- A `conflict` is stored as an event alongside the other events; it is not
  overwritten by whichever response arrived last.
- `credited` requires a destination-bank source event. A scheme correction,
  acknowledgement, or retry alone cannot produce it.
- `next_action` is drawn from a human-reviewed rule. An unknown or withdrawn
  rule must use safe official-contact guidance.
- `next_payment_event` links reprocessing to a later source event rather than
  asserting that correction caused credit.
