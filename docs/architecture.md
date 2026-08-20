# Proposed production architecture

This is a proposal for an authorised cross-organisation service, not an
implemented integration. The prototype currently uses local fictional fixtures
and deterministic rules only.

## Evidence boundary

- **Observed public evidence:** DBT Bharat and PFMS describe payment stages,
  account-based and Aadhaar-based routes, returns, and citizen payment
  resources. The [DBT payments and failure resources](https://dbtbharat.gov.in/index.php/static-page-content/spagecont?id=4)
  and [PFMS DBT FAQ](https://pfms.nic.in/SitePages/doc/PFMS_DBT_FAQ.pdf)
  support the vocabulary used by this prototype.
- **Prototype behavior:** Three local synthetic cases, local event rendering,
  deterministic diagnosis, browser-held state, and browser printing.
- **Proposed production behavior:** Authorised adapters, consent, identity
  checks, a case trail, and organisation-owned correction/reprocessing events.
- **Unresolved:** Participating organisations, approved interfaces, service
  levels, retention, and the identity pattern must be agreed before build.

## Event path

```text
authorised scheme / PFMS / sponsor-bank / payment-rail / destination-bank source
  -> adapter validation and masking
  -> normalised status-and-resolution event
  -> reviewed rule match or safe unknown fallback
  -> citizen explanation and correction evidence
  -> owner acknowledgement and case trail
  -> scheme record correction and payment reprocessing
  -> independently confirmed final payment event
```

Each adapter must retain the source name, source event identifier, received
timestamp, source timestamp, route, and raw reason. Normalisation must never
replace a conflicting event or turn an unavailable response into a success.

## Proposed components

1. A citizen interface accepts the minimum case reference and shows masked
   context. It does not display a full Aadhaar or bank account number.
2. An adapter gateway accepts only authorised, documented interfaces and
   converts source responses into the contract in
   [status-resolution-contract.md](status-resolution-contract.md).
3. A rules service selects only human-reviewed, versioned rules. Unknown or
   withdrawn reasons produce a safe fallback with official-contact guidance.
4. A case trail records consent, source evidence, owner handoff, correction
   proof, retry, and payment events with idempotency keys.
5. Organisation systems remain authoritative for eligibility, beneficiary
   records, reprocessing, and credit. A bank correction does not approve a
   benefit or automatically reissue a payment.

## Failure handling

The [failure-mode matrix](failure-modes.md) is the minimum operational contract.
The service should show the latest confirmed event, preserve conflicts, label
stale or unavailable sources, and stop short of a specific remedy when no
reviewed rule applies.
