# Validation matrix: expedition-debrief-judge

Status: **pending** — populated per wave as evidence lands (see tasks.md). No implementation task may be marked complete while its row is pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| FR-001 MCQ path always available, mastery-equivalent | unit + manual MCQ-only parity run | — | pending |
| FR-002 judge never blocks progression nor demotes below MCQ floor | unit (floor invariant, outage fallback) + manual outage scenario | — | pending |
| FR-003 explicit revocable consent; no egress without it | browser test (network inspection) + manual | — | pending |
| DJ-001 worker discipline (allowlist, caps, origin, rate limit, fail closed, no storage) | unit (`worker.fetch` suite) + documented deployment-config review incl. platform request-body logging disabled | — | pending |
| DJ-002 schema-constrained booleans; authored-bank feedback only | unit (server + client discard paths) | — | pending |
| DJ-003 client-side pure delta function; MD-004 parity | unit | — | pending |
| DJ-004 injection containment; harness registration | unit (corpus replay) + live evaluation transcript | — | pending |
| DJ-005 truthful, deployment-verifiable privacy disclosure | documented provider-retention and platform-logging review + browser consent/revocation check | — | pending |
| TM-003 baseline threat model prerequisite and judge update | documented review of `docs/ai-threat-model.md` before implementation | — | pending |

## Required commands

```bash
npm run check
npm test
npm run test:browser
npm run test:a11y
openspec validate expedition-debrief-judge --strict
```

A command alone is not evidence unless its dated output or CI run is linked.

## Manual scenario notes

Recorded here with date, browser, viewport, and observed behavior when manual checks run.
