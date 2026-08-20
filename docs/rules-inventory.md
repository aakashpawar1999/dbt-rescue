# Versioned deterministic rules inventory

All rules are local, source-backed demo rules. They do not call a government,
bank, identity, grievance, or model service. Only the three rows marked
`human-reviewed` enter the shipped rules table; an unknown or withdrawn reason
uses the safe fallback and cannot provide a specific remedy.

| Rule ID | Version | Reference | Scheme scope | Route | Raw reason | Source title and URL | Review date | Reviewer status |
|---|---|---|---|---|---|---|---|---|
| `DBT-SUNITA-001-RULE-1` | `1.0.0` | `DBT-SUNITA-001` | Farmer benefit demo | Aadhaar-based | `MAPPED_TO_BANK_B` | [DBT payments and failure resources](https://dbtbharat.gov.in/index.php/static-page-content/spagecont?id=4) | 2026-08-20 | `human-reviewed` |
| `DBT-ARJUN-002-RULE-1` | `1.0.0` | `DBT-ARJUN-002` | Scholarship demo | Account-based | `INVALID_IFSC` | [PFMS validation and payment rejection remedies](https://pfms.nic.in/sitePages/doc/PFMS_Validation_Payment_Rejection_Remedies.pdf) | 2026-08-20 | `human-reviewed` |
| `DBT-MEENA-003-RULE-1` | `1.0.0` | `DBT-MEENA-003` | Social pension demo | Aadhaar-based | `UID_NOT_MAPPED` | [NPCI Aadhaar Payments Bridge SOP](https://www.npci.org.in/PDF/nach/notofied-document/Aadhaar-Payments-Bridge-%28APB%29-System-SOP_V3.0.3.pdf) | 2026-08-20 | `human-reviewed` |

## Remedy sign-off

The domain-review decision covers the source, route, scheme scope, raw reason,
plain explanation, responsible owner, action, document checklist, and next
state for each row above. The review date is stored with the rule and displayed
in the audit view. A source change, stale review, or missing sign-off changes
the status to `unreviewed` or `withdrawn`; such a rule is rejected by the
runtime resolver and receives no specific remedy.

## Safe fallback

`UNKNOWN-RAW-REASON` has reviewer status `unreviewed`, no source URL, and tells
the reviewer to seek official guidance. It is intentionally not a remedy rule.
