# ChatGPT Sites publishing

This is the current hosting and release path for DBT Rescue. It records the
working public deployment, the files that make the Site buildable, and the
steps for the next release.

## Current hosted state

- Public URL: <https://dbt-rescue.aakashpawar1999.chatgpt.site/>
- Access: public; no ChatGPT login is required to view the Site.
- Current Site version: `4`.
- Current hosted source: commit `6dd0e847da6d8717f9826a3894d9abf4194915a7`.
- Last verified: 25 August 2026. The root returned HTTP 200, and the emitted
  JavaScript and CSS assets also returned HTTP 200.
- The requested `dbt-rescue.chatgpt.site` hostname is not assigned. Sites
  currently exposes the account-scoped hostname above for this project.

The shorter hostname must not be copied into release material as if it were a
working link. A custom domain requires a domain and DNS configuration that the
publisher controls; it is not the same as changing the Site slug.

## Source and build contract

- `.openai/hosting.json` is the only hosting configuration committed to the
  repository. It stores the existing Site `project_id`.
- `vite.config.ts` uses the OpenAI Sites Vite plugin for deployment metadata and
  the Cloudflare Vite plugin for the Workers-compatible build.
- `worker/index.ts` serves `/index.html` for the Site root through the `ASSETS`
  binding.
- `scripts/prepare-sites-artifact.mjs` adapts the Cloudflare output to the
  Sites package contract by placing the worker at `dist/server/index.js`.
- The Sites package helper stages `dist/`, the hosting metadata, and the
  generated client assets into the archive saved as a Site version.

## Next-release checklist

1. Make the feature or fix on the normal development branch.
2. Run `bun run test`, `bun run lint`, and `bun run build`.
3. Confirm the diff contains no real personal data, credentials, long-lived
   Site token, or unexpected generated files.
4. Commit the validated source. Keep `.ultraship/` local-only.
5. Push that exact commit to the existing Sites source repository using the
   short-lived credential provided by the Sites connector. Never put the token
   in the remote URL, a workflow file, or repository configuration.
6. Package the successful build with the Sites `package-site.sh` helper.
7. Save one Site version using the pushed commit SHA and archive.
8. Deploy the saved version publicly, because this Site is intentionally public.
9. Poll until deployment succeeds, then fetch the public root and at least one
   emitted asset. A deployment status alone is not enough.
10. Record the new version, commit, URL, and verification date here and in the
    submission manifest when they are relevant to the release.

Reuse this Site project for every release. Do not call Site creation again.

## Automation boundary

GitHub Actions currently runs the repeatable checks in `.github/workflows/ci.yml`
and verifies tagged releases in `.github/workflows/release.yml`. It does not
publish to ChatGPT Sites. The Sites publish step uses a short-lived connector
credential and Site-version/deployment operations that are not exposed here as
a stable unattended GitHub Actions API.

This keeps the safe automation boundary explicit:

```text
GitHub push or tag
  -> CI: install, lint, test, build
  -> Sites/Codex: push exact source, save version, deploy
  -> public URL: fetch root and assets
```

If Sites later provides a supported non-interactive publish API, the final two
steps can move into a protected workflow. Until then, do not create a custom
workflow that stores a long-lived credential or guesses at an undocumented API.

## Removed hosting path

The GitHub Pages workflow was removed. Historical release notes may still
mention Pages because they record what was true at the time; they are not an
instruction to restore it.
