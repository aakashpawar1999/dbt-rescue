# Functional versus simulated

This is an independent hackathon prototype. The distinction below is part of
the product contract and should remain visible in the demo and submission.
The audit view is a functional local disclosure of the evidence attached to a
synthetic diagnosis; it is not a live source lookup.

The 0.3.0 interface shows this disclosure in both English and Hindi. Switching
language, assisted mode, printing, and moving the local tracker are functional
browser interactions; none submits a record to a government, bank, or other
external service.

The current build is publicly hosted on ChatGPT Sites at
<https://dbt-rescue.aakashpawar1999.chatgpt.site/> and can be opened without a
ChatGPT login. Hosting makes the browser bundle reachable; it does not add a
backend or turn any simulated behavior into a live integration.

| Capability | Prototype behavior |
|---|---|
| Safe lookup | Functional for the three fictional references `DBT-SUNITA-001`, `DBT-ARJUN-002`, and `DBT-MEENA-003` only. |
| Payment timeline | Functional local rendering of fictional Aadhaar-based and account-based events with source, timestamp, route, and missing/conflicting status. |
| Failure diagnosis | Functional deterministic rules reviewed against the product brief for mapped-account success, invalid IFSC, and unavailable Aadhaar mapping. |
| Diagnosis provenance | Functional local rendering of the matched fictional event, stable rule identifier/version, raw reason, source label/URL, scheme scope, route, review date, and reviewer status. |
| Unknown-rule fallback | Functional safe local behavior that withholds a specific remedy when a raw reason has no reviewed rule. |
| Conflict preservation | Functional local rendering of every fictional event and the latest confirmed event without deleting conflicting or missing reports. |
| Owner and remedy | Functional local guidance for the responsible bank, scheme department, or trace desk. |
| Correction packet | Functional browser-rendered and browser-printable page using masked synthetic values. |
| Trace request | Functional browser-rendered and browser-printable request for the mapped-account scenario. |
| Public hosting | Functional public delivery of the built browser bundle through ChatGPT Sites; no user account is required to view it. |
| Acknowledgement | Simulated local acknowledgement; no bank or pension office receives it. |
| Record update | Simulated local state transition. |
| Payment reissue | Simulated local state transition. |
| Account credit | Simulated final state; not a bank confirmation and not a money movement. |
| PFMS, NPCI, bank, Aadhaar, and scheme systems | Simulated labels and local fixture data only. |
| Eligibility and approval | Not provided. DBT Rescue does not decide whether anyone qualifies. |

## Proposed, not functional

The production architecture, privacy/security model, operating model,
status-and-resolution contract, failure handling, authorised adapters, consent,
case trail, reprocessing, notifications, and governance documents are proposed
boundaries. They require participating-organisation approval and are not
implemented by this release.

Never enter real Aadhaar numbers, bank-account numbers, OTPs, government login
details, or personal information. The app makes no live government, banking,
identity, analytics, or model API requests.
