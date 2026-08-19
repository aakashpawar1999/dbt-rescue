# dbt-rescue
Paisa Kahan Atka? — DBT Rescue | A citizen expecting a government benefit can understand where the payment   stopped, why it failed, who can fix it, and how to track it through recovery.

## Planned stack

- React + TypeScript + Vite
- Tailwind CSS through `@tailwindcss/vite`, with semantic HTML and a 360 px mobile-first baseline
- Local JSON fixtures and deterministic TypeScript rules
- Browser state and browser-native printing; no backend, database, authentication, or live government APIs
- Vitest for automated checks
- Node.js 24 LTS and npm for development and CI

This is a mobile-first web app, not a separate native mobile app. A PWA layer is intentionally deferred unless the working prototype proves it is needed.

## Automation

GitHub Actions runs install, lint, tests, and build checks after the application scaffold adds `package-lock.json`. Pushing a version tag such as `v0.1.0` runs the same checks and creates a GitHub Release with generated notes.
