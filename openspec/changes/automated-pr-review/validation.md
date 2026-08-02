# Validation matrix: automated-pr-review

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| Repository-owned CodeRabbit review policy | local YAML parse and content inspection | 2026-08-02 — Ruby/Psych parsed `.coderabbit.yaml`; inspected instructions cover runtime, HTML, service worker, optional Worker, OpenSpec, tests, workflows, and README without Python/CLI assumptions. | passed |
| Automatic review covers `dev` and excludes drafts | checked-in Ruby/YAML contract | 2026-08-02 21:50 CEST — `ruby scripts/check-coderabbit-config.rb` asserted `^dev$`, `^main$`, `drafts: false`, `auto_incremental_review: true`, `auto_pause_after_reviewed_commits: 0`, and the OpenSpec/README documentation path instructions. | passed |
| Local configuration contract is documented | README inspection and checked-in command | 2026-08-02 21:50 CEST — README invokes the same credential-free `ruby scripts/check-coderabbit-config.rb` contract. | passed |

## Manual/service follow-up

After CodeRabbit is installed for the GitHub repository, open or update a non-draft pull request targeting `dev` and confirm its review/check appears. This external integration confirmation cannot be performed from a local checkout without the GitHub App installation.
