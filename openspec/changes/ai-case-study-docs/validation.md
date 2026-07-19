# Validation matrix: ai-case-study-docs

Status: **pending** — populated per wave as evidence lands (see tasks.md). No implementation task may be marked complete while its row is pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| CS-001 four areas covered; README link | manual review | — | pending |
| CS-002 every claim traceable; honest status labels | documented claim-by-claim review | — | pending |
| CS-003 in-repo static markdown | manual rendering check | — | pending |
| TM-001 complete surface inventory with boundaries | manual review against change set | — | pending |
| TM-002 every threat mitigated or explicitly accepted | documented review | — | pending |
| TM-003 governance rule wired into review checklist | process evidence | — | pending |

## Required commands

```bash
npm run check
npm test
npm run test:browser
npm run test:a11y
openspec validate ai-case-study-docs --strict
```

A command alone is not evidence unless its dated output or CI run is linked.

## Manual scenario notes

Recorded here with date and reviewer when documentation reviews run.
