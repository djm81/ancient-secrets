# Validation matrix: automated-pr-review

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| Repository-owned CodeRabbit review policy | local YAML parse and content inspection | 2026-08-02 — Ruby/Psych parsed `.coderabbit.yaml`; inspected instructions cover runtime, HTML, service worker, optional Worker, OpenSpec, tests, workflows, and README without Python/CLI assumptions. | passed |
| Automatic review covers `dev` and excludes drafts | local YAML contract check | 2026-08-02 — extended Ruby contract asserted `^dev$`, `drafts: false`, `auto_incremental_review: true`, and OpenSpec path instructions. | passed |
| Local configuration contract is documented | README inspection and command | 2026-08-02 — README documents the external-app boundary, `dev`/`main` policy, draft behavior, and a credential-free parse/branch command. | passed |

## Manual/service follow-up

After CodeRabbit is installed for the GitHub repository, open or update a non-draft pull request targeting `dev` and confirm its review/check appears. This external integration confirmation cannot be performed from a local checkout without the GitHub App installation.
