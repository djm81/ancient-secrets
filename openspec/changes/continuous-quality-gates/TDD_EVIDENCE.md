# TDD evidence: continuous-quality-gates

Status: **in progress**.

## A1 — workflow contract

- Requirements: CQ-001, CQ-002, CQ-003.
- Test: `tests/quality-gates-workflow.test.js` reads the committed workflow and checks trigger, permissions, and validation commands.
- Failing command (2026-07-21, Europe/Berlin): `node --test tests/quality-gates-workflow.test.js`.
- Failing result: `ENOENT: no such file or directory, open '.github/workflows/quality-gates.yml'`.
- Implementation: `.github/workflows/quality-gates.yml` installs declared dependencies and Chromium, then runs syntax, unit, browser, accessibility, and whitespace checks with read-only permissions.
- Passing evidence (2026-07-21, Europe/Berlin): `node --test tests/quality-gates-workflow.test.js` — 1 passed; `openspec validate continuous-quality-gates --strict` — valid.
