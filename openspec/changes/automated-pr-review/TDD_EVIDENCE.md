# TDD evidence: automated-pr-review

Discipline: spec → tests → **failing evidence** → implementation → **passing evidence**. This configuration-only change uses a local YAML parse-and-contract check; CodeRabbit itself is an optional external GitHub App and is not required to run the check.

## Review follow-up — complete CodeRabbit policy-contract coverage

- Spec refs: automated-pr-review requirements 1–3.
- Test and command: `node --test tests/coderabbit-config.test.js` and `ruby scripts/check-coderabbit-config.rb`.
- Expected failing result / justified exception: 2026-08-02 — the checked-in configuration already enables automatic review and contains every policy path, so this is a coverage repair. The existing checker can nevertheless pass if `enabled` is false or runtime, HTML, Worker, test, or workflow guidance is removed. New negative fixtures must fail for those cases before the contract implementation is extended.
- Passing evidence: 2026-08-02 22:28 CEST — `node --test tests/coderabbit-config.test.js tests/offline-shell.test.js` passed 9/9 and `ruby scripts/check-coderabbit-config.rb` printed `CodeRabbit review-policy contract valid`. Negative fixtures reject `enabled: false` and altered service-worker policy text; the checker now validates every required path and its policy fragments. Final gates at 22:31 CEST: `npm run check`, `npm test` (52/52), `npm run test:browser` (54/54), and `npm run test:a11y` (4/4) passed.

## AD-001 — repository-owned review policy

- Spec refs: automated-pr-review requirements 1–3.
- Contract command: `ruby -e 'require "yaml"; c = YAML.load_file(".coderabbit.yaml"); abort "missing dev auto-review target" unless c.dig("reviews", "auto_review", "base_branches").include?("^dev$")'`
- Failing evidence: 2026-08-02 01:07 CEST — the contract command failed with `Errno::ENOENT` because `.coderabbit.yaml` did not exist.
- Passing evidence: 2026-08-02 01:08 CEST — the extended local contract printed `CodeRabbit YAML and dev review contract valid`; it parsed `.coderabbit.yaml`, asserted the `^dev$` base branch, draft exclusion, incremental review, and OpenSpec path instructions. `npm run check`, `npm test` (45/45), and `git diff --check` also passed.
- Notes / exceptions: A local parse-and-contract check verifies the project-owned invariant. CodeRabbit schema validation and review execution require the external GitHub App installation and are verified through the service after merge.

## AD-002 — complete incremental-review policy contract

- Spec refs: automated-pr-review requirements 2–3.
- Contract command: `ruby -e 'require "yaml"; a = YAML.load_file(".coderabbit.yaml").fetch("reviews").fetch("auto_review"); abort "missing review target" unless ["^dev$", "^main$"].all? { |branch| a.fetch("base_branches").include?(branch) }; abort "draft reviews enabled" unless a.fetch("drafts") == false; abort "incremental review pause enabled" unless a.fetch("auto_pause_after_reviewed_commits") == 0'`.
- Failing evidence: 2026-08-02 20:03 CEST — the extended local contract raised `KeyError` for the missing `auto_pause_after_reviewed_commits` key.
- Passing evidence: 2026-08-02 20:05 CEST — the contract printed `CodeRabbit full auto-review contract valid`, asserting `^dev$`, `^main$`, `drafts: false`, and `auto_pause_after_reviewed_commits: 0`.

## Review follow-up — one reproducible documented review-policy contract

- Spec refs: automated-pr-review requirements 1–3.
- Contract command: `ruby scripts/check-coderabbit-config.rb`.
- Expected failing result: 2026-08-02 — the previous recorded snippets did not themselves assert every claimed invariant, including `auto_incremental_review: true` and the OpenSpec documentation path instruction.
- Implementation reference: `scripts/check-coderabbit-config.rb` is the single checked-in Ruby/Psych contract; README and this evidence both invoke it.
- Passing evidence: 2026-08-02 21:50 CEST — `ruby scripts/check-coderabbit-config.rb` printed `CodeRabbit review-policy contract valid`, asserting both base branches, draft exclusion, incremental review enabled, no pause, and OpenSpec/README documentation path instructions.
