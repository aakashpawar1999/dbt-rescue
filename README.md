# Paisa Kahan Atka? — DBT Rescue

An independent hackathon prototype that helps a citizen understand where a
fictional government benefit payment stopped, why it failed, who can fix it, and
how to follow simulated recovery.

## Safe demo

Use only the fictional reference `DBT-MEENA-003`. Never enter a real Aadhaar
number, bank-account number, OTP, government login, or personal information.
This prototype has no live government, banking, identity, analytics, or model
API requests.

## Local development

Requires Node.js 24 LTS and npm.

```sh
npm install
npm run dev
```

Checks and production build:

```sh
npm test
npm run lint
npm run build
```

The app uses local fictional fixtures, deterministic rules, browser state, and
browser-native printing. Printing the correction request uses the browser's
print dialog; no document is uploaded anywhere.

## Scope

The current release demonstrates one English pension-payment rescue journey
with simulated acknowledgement, record update, reissue, and final credit. It
is not an official government service and does not determine eligibility,
correct real records, or release money.

See [functional-versus-simulated disclosure](docs/functional-vs-simulated.md)
and the [dependency and asset inventory](docs/dependencies-and-assets.md).
