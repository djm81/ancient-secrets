# Validation matrix: adaptive-guidance

Status: **pending** — populated per wave as evidence lands (see tasks.md). No implementation task may be marked complete while its row is pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| AG-001 pure deterministic suggestion | unit | — | pending |
| AG-002 signals local-only, zero egress | unit (summary exclusion) + manual network inspection | — | pending |
| AG-003 dismissible, never auto-reveals, no re-prompt | browser test + manual | — | pending |
| AG-004 fully functional with no AI configured | unit + manual AI-free flow | — | pending |
| AG-005 opt-out disables and clears | unit + manual | — | pending |

## Required commands

```bash
npm run check
npm test
npm run test:browser
npm run test:a11y
openspec validate adaptive-guidance --strict
```

A command alone is not evidence unless its dated output or CI run is linked.

## Manual scenario notes

Recorded here with date, browser, viewport, and observed behavior when manual checks run.
