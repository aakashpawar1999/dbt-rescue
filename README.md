# Paisa Kahan Atka? — DBT Rescue

An independent hackathon prototype that helps a citizen understand where a
fictional government benefit payment stopped, why it failed, who can fix it, and
how to follow simulated recovery.

## Safe demo

Use only these fictional references: `DBT-SUNITA-001` (Aadhaar-based farmer
benefit), `DBT-ARJUN-002` (account-based scholarship), and `DBT-MEENA-003`
(Aadhaar-based pension). Never enter a real Aadhaar number, bank-account
number, OTP, government login, or personal information. This prototype has no
live government, banking, identity, analytics, or model API requests.

## Local development

Requires Bun and Node.js 24 LTS.

```sh
bun install
bun run dev
```

Checks and production build:

```sh
bun run test
bun run lint
bun run build
```

The app uses local fictional fixtures, deterministic rules, browser state, and
browser-native printing. Printing the correction request uses the browser's
print dialog; no document is uploaded anywhere.

## Scope

The 0.2.0 release demonstrates three English payment journeys across
Aadhaar-based and account-based routes, including a mapped-account success,
an invalid-IFSC correction, and an unavailable Aadhaar mapping. It is not an
official government service and does not determine eligibility, correct real
records, or release money.

See [functional-versus-simulated disclosure](docs/functional-vs-simulated.md)
and the [dependency and asset inventory](docs/dependencies-and-assets.md).
