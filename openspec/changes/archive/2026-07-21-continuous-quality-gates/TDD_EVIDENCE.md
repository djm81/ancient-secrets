# TDD evidence: continuous-quality-gates

Status: **in progress**.

## A1 — workflow contract

- Requirements: CQ-001, CQ-002, CQ-003.
- Test: `tests/quality-gates-workflow.test.js` reads the committed workflow and checks trigger, permissions, and validation commands.
- Failing command (2026-07-21, Europe/Berlin): `node --test tests/quality-gates-workflow.test.js`.
- Failing result: `ENOENT: no such file or directory, open '.github/workflows/quality-gates.yml'`.
- Implementation: `.github/workflows/quality-gates.yml` installs declared dependencies and Chromium, then runs syntax, unit, browser, accessibility, and whitespace checks with read-only permissions.
- Passing evidence (2026-07-21, Europe/Berlin): `node --test tests/quality-gates-workflow.test.js` — 1 passed; `openspec validate continuous-quality-gates --strict` — valid; GitHub Actions run [29865466167](https://github.com/djm81/ancient-secrets/actions/runs/29865466167) — passed in 1m14s.

## Review remediation — PR #14 submitted-diff whitespace gate

- Requirement: CQ-001.
- Test: `tests/quality-gates-workflow.test.js` requires full checkout history and a `git diff --check` command with explicit base and head commits.
- Failing command (2026-07-22, Europe/Berlin): `node --test tests/quality-gates-workflow.test.js`.
- Failing result: the workflow checked only the clean runner worktree because its whitespace command had no submitted-diff range.
- Implementation: the workflow fetches full history, derives the PR base or push predecessor (with a new-branch fallback), then checks that submitted range.
- Passing evidence (2026-07-22, Europe/Berlin): `node --test tests/quality-gates-workflow.test.js` — 1 passed.
