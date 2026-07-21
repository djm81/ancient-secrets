# Validation matrix: verified-puzzle-pipeline

Status: **pending** — populated per wave as evidence lands (see tasks.md). No implementation task may be marked complete while its row is pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| VP-001 static verified data only; zero runtime model calls | manual offline playthrough + payload inspection | — | pending |
| VP-002 every shipped variant passes the structural solver | unit (verifier suite) + committed verdict log | — | pending |
| VP-003 committed, reproducible verification log | audit re-run evidence | — | pending |
| VP-004 schema validation + curation records in CI | unit (data-validation suite) | — | pending |
| VP-005 seed-deterministic, save-stable selection | unit (save round-trip) | — | pending |
| VP-006 semantic clarity and fairness receive recorded human curation | committed checklist + reviewer record | — | pending |
| TM-003 baseline threat model prerequisite and authoring-pipeline update | documented review of `docs/ai-threat-model.md` before implementation | — | pending |

## Required commands

```bash
npm run check
npm test
npm run test:browser
npm run test:a11y
openspec validate verified-puzzle-pipeline --strict
```

A command alone is not evidence unless its dated output or CI run is linked.

## Manual scenario notes

Recorded here with date, browser, viewport, and observed behavior when manual checks run.
