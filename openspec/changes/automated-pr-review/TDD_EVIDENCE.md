# TDD evidence: automated-pr-review

Discipline: spec → tests → **failing evidence** → implementation → **passing evidence**. This configuration-only change uses a local YAML parse-and-contract check; CodeRabbit itself is an optional external GitHub App and is not required to run the check.

## AD-001 — repository-owned review policy

- Spec refs: automated-pr-review requirements 1–3.
- Contract command: `ruby -e 'require "yaml"; c = YAML.load_file(".coderabbit.yaml"); abort "missing dev auto-review target" unless c.dig("reviews", "auto_review", "base_branches").include?("^dev$")'`
- Failing evidence: 2026-08-02 01:07 CEST — the contract command failed with `Errno::ENOENT` because `.coderabbit.yaml` did not exist.
- Passing evidence: 2026-08-02 01:08 CEST — the extended local contract printed `CodeRabbit YAML and dev review contract valid`; it parsed `.coderabbit.yaml`, asserted the `^dev$` base branch, draft exclusion, incremental review, and OpenSpec path instructions. `npm run check`, `npm test` (45/45), and `git diff --check` also passed.
- Notes / exceptions: A local parse-and-contract check verifies the project-owned invariant. CodeRabbit schema validation and review execution require the external GitHub App installation and are verified through the service after merge.
