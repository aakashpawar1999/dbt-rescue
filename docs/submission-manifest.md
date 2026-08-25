# DBT Rescue 0.5.0 submission manifest

Status: transcript-only `v0.5.0` release package with a verified current public
ChatGPT Sites deployment. The immutable `v0.5.0` release record and the current
post-release hosting source are intentionally tracked separately. Organiser
submission destination remains unknown.

| Item | Value | Verification |
| --- | --- | --- |
| Repository | <https://github.com/aakashpawar1999/dbt-rescue> | Verified public and readable signed-out |
| Intended demo | <https://dbt-rescue.aakashpawar1999.chatgpt.site/> | Verified production ChatGPT Sites deployment and public access |
| Current Site version | `4` | Verified deployed public version; root and emitted assets returned HTTP 200 on 2026-08-25 |
| Current hosted source | `6dd0e847da6d8717f9826a3894d9abf4194915a7` | Post-release Sites asset and root-serving fix; not a rewritten `v0.5.0` tag |
| Intended release | <https://github.com/aakashpawar1999/dbt-rescue/releases/tag/v0.5.0> | Verified published GitHub Release |
| Transcript | <https://github.com/aakashpawar1999/dbt-rescue/blob/main/docs/demo-transcript.md> | Public transcript artifact; verify after documentation publication |
| Submission destination | Organiser-provided URL or form | Unknown in the local research snapshot |
| Release tag | `v0.5.0` | Verified |
| Commit | `6a97eb3ad68be423c7cb39bc0508f79b393da165` | Verified deployed release commit |
| Build date | `2026-08-20` UTC / `2026-08-20` IST | Verified release date |
| Functional scope | Three fictional cases, deterministic diagnosis, provenance, bilingual journey, assisted mode, masked packet, simulated tracker | Verified on public release path |
| Simulated scope | Government, PFMS, NPCI, Aadhaar, bank, identity, grievance, acknowledgement, reissue, and credit behavior | Visible in public release |
| Known limitations | No live integrations, eligibility decision, real correction, real payment movement, or real credit confirmation | See [known limitations](known-limitations.md) |

## Current hosting verification

- The public Site opens without a ChatGPT login.
- The account-scoped URL above is the working public link. The shorter
  `dbt-rescue.chatgpt.site` hostname is not assigned by Sites.
- GitHub Pages publishing has been removed. GitHub Actions remains the CI and
  GitHub Release verification path; Site version publishing is documented in
  [sites-publishing.md](sites-publishing.md).

## Freeze checklist

- [x] `bun run test`, `bun run lint`, and `bun run build` pass on the current hosted source.
- [ ] GitHub Actions CI is green for the release commit.
- [x] ChatGPT Sites opens for the intended public audience without a login.
- [ ] The tagged GitHub Release points at the deployed commit.
- [x] The timed demo script and transcript describe the actual release build.
- [x] Repository, demo, transcript, release, and source links open without editor access.
- [x] Exact tag, commit, build date, and verified URLs are filled above.
- [x] The current post-release Site version and hosted source are recorded separately from the immutable tag.
- [ ] No real personal data, credential, secret, unsupported claim, or unfinished feature appears in the package.
