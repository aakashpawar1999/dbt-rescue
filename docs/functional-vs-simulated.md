# Functional versus simulated

This is an independent hackathon prototype. The distinction below is part of
the product contract and should remain visible in the demo and submission.

| Capability | Prototype behavior |
|---|---|
| Safe lookup | Functional for the three fictional references `DBT-SUNITA-001`, `DBT-ARJUN-002`, and `DBT-MEENA-003` only. |
| Payment timeline | Functional local rendering of fictional Aadhaar-based and account-based events with source, timestamp, route, and missing/conflicting status. |
| Failure diagnosis | Functional deterministic rules reviewed against the product brief for mapped-account success, invalid IFSC, and unavailable Aadhaar mapping. |
| Owner and remedy | Functional local guidance for the responsible bank, scheme department, or trace desk. |
| Correction packet | Functional browser-rendered and browser-printable page using masked synthetic values. |
| Trace request | Functional browser-rendered and browser-printable request for the mapped-account scenario. |
| Acknowledgement | Simulated local acknowledgement; no bank or pension office receives it. |
| Record update | Simulated local state transition. |
| Payment reissue | Simulated local state transition. |
| Account credit | Simulated final state; not a bank confirmation and not a money movement. |
| PFMS, NPCI, bank, Aadhaar, and scheme systems | Simulated labels and local fixture data only. |
| Eligibility and approval | Not provided. DBT Rescue does not decide whether anyone qualifies. |

Never enter real Aadhaar numbers, bank-account numbers, OTPs, government login
details, or personal information. The app makes no live government, banking,
identity, analytics, or model API requests.
