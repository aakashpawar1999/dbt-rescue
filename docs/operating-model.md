# Proposed cross-organisation operating model

The roles below are proposed ownership boundaries. The prototype does not call
any of these systems and does not claim their approval.

| Actor | Authoritative responsibility | Evidence this layer may consume or request |
|---|---|---|
| Scheme department | Eligibility, beneficiary record, correction, and payment reissue request | Scheme status, correction acknowledgement, reprocessing event |
| PFMS or scheme payment system | Payment instruction and status responses | Validated, returned, or submitted payment event |
| Sponsor bank | Payment-file submission and response to the payment rail | Submission and response identifiers |
| NPCI or payment rail | Aadhaar mapping or payment routing where authorised | Mapping/routing event and source timestamp |
| Destination bank | Account status, receipt, credit, or trace response | Bank-owned response, never inferred credit |
| Grievance system | Complaint intake, routing, status, and escalation | Grievance identifier and organisation response |
| DBT Rescue operations | Rule governance, normalisation, consent trail, source freshness, and safe fallback | Masked event trail and review decision |

## Rule governance

The product-operations owner maintains the rule register. A domain reviewer
checks the source, route, scheme scope, raw reason, explanation, owner, action,
documents, and next state. A privacy reviewer checks masking and data handling.
The release process records the reviewer status and review date. A source change
or expiry disables the specific remedy until a new review is recorded.

## Handoff rules

- A bank response cannot edit a scheme beneficiary record.
- A scheme correction does not prove that payment was reissued.
- A retry does not prove destination-bank credit.
- A grievance is offered only when the reviewed rule or responsible owner says
  it is appropriate.
- Conflicts and missing responses remain visible to the next owner.
