# Proposed failure-mode matrix

| Failure mode | Visible behavior | Safe operational response | Owner |
|---|---|---|---|
| Source integration unavailable | Source is marked unavailable with the last received timestamp; no success is inferred | Retry within a bounded window, then route to the source owner | Adapter owner |
| Source is stale | Event is labelled stale and its age is shown | Request a fresh response before a specific remedy is shown | Source owner |
| Sources conflict | Each event remains visible with source and timestamp | Escalate reconciliation to the actor that owns the conflicting fields | Operations |
| Raw reason is unknown | No specific remedy is displayed; safe official-contact guidance is shown | Add a rule only after source and domain review | Rule-governance owner |
| Correction without retry | Correction acknowledgement is separate from payment reissue | Ask the scheme department for the reprocessing event | Scheme department |
| Retry without credit | Reissue is separate from destination-bank credit | Ask the destination bank to trace the source payment event | Destination bank |
| Duplicate acknowledgement | Same request is shown once using an idempotency key | Reconcile the duplicate with the acknowledgement owner | Case-trail owner |
| Service outage | Case submission is not claimed; a local retry state and support route are shown | Recover the service, replay only idempotent requests, and publish the incident outcome | Product operations |

These behaviors are proposed production handling. The local prototype simulates
the displayed journey and does not execute retries, source calls, or production
incident response.
