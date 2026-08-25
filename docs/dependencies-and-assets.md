# Dependencies and assets

## Runtime and development dependencies

| Item | Purpose | Licence |
|---|---|---|
| Bun | Dependency installation and project scripts | MIT |
| React | UI runtime | MIT |
| React DOM | Browser rendering | MIT |
| TypeScript | Type checking | Apache-2.0 |
| Vite | Development server and static build | MIT |
| `@cloudflare/vite-plugin` | Cloudflare Workers-compatible Site build and asset binding | MIT |
| `@openai/sites-vite-plugin` | ChatGPT Sites deployment metadata | MIT |
| `@vitejs/plugin-react` | React support for Vite | MIT |
| Tailwind CSS | CSS utility framework | MIT |
| `@tailwindcss/vite` | Tailwind integration for Vite | MIT |
| Vitest | Deterministic automated checks | MIT |

The version ranges are declared in `package.json`; exact resolved versions are
locked in `bun.lock`. The current Sites build uses exact plugin versions so the
deployment contract stays reproducible.

| Package source | Recorded version | Licence evidence |
|---|---|---|
| [React](https://github.com/facebook/react) | `^19.1.1` | MIT |
| [React DOM](https://github.com/facebook/react) | `^19.1.1` | MIT |
| [TypeScript](https://github.com/microsoft/TypeScript) | `^5.9.2` | Apache-2.0 |
| [Vite](https://github.com/vitejs/vite) | `^7.1.3` | MIT |
| [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | `^4.1.12` | MIT |
| [Vitest](https://github.com/vitest-dev/vitest) | `^3.2.4` | MIT |
| Cloudflare Vite plugin ([Workers SDK](https://github.com/cloudflare/workers-sdk)) | `1.37.1` | MIT |
| OpenAI Sites Vite plugin (Sites build toolchain) | `0.1.0` | MIT |

Exact resolved versions are recorded in `bun.lock`.

## Assets and data

- No external image, font, icon, audio, or video asset is used by the application.
- All beneficiary, payment, bank, status, and acknowledgement values are fictional fixtures created for this prototype.
- No live API, remote model, analytics, or third-party data source is used at runtime.

## 0.4.0 additions

| Introduced item | Source | Licence/status |
|---|---|---|
| Rule provenance metadata | Repository-authored TypeScript and the linked public source register | Project code; source-backed, human-reviewed remedies only |
| Audit view | Repository-authored React and CSS | Project code; no external asset |
| Production documents | Repository-authored Markdown | Project documentation; proposed controls, not third-party content |
| Dataset | Three repository-authored fictional cases | Synthetic; no personal or financial data |

## Current hosting additions

| Introduced item | Source | Licence/status |
|---|---|---|
| Sites worker entrypoint | Repository-authored `worker/index.ts` | Project code; serves the built asset binding |
| Sites artifact adapter | Repository-authored `scripts/prepare-sites-artifact.mjs` | Project build tooling |
| Sites deployment metadata | `.openai/hosting.json` | Project configuration; stores only the Site project ID |
| Cloudflare and OpenAI Sites plugins | `package.json` and `bun.lock` | Build tooling; no runtime API or user data |

## 0.5.0 release additions

| Introduced item | Source | Licence/status |
|---|---|---|
| Bun CI workflow step | [oven-sh/setup-bun](https://github.com/oven-sh/setup-bun) | MIT; workflow tooling only |
| Demo and submission documents | Repository-authored Markdown | Project documentation; no external media asset included |
