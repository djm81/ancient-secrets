# Validation matrix: on-device-guidance

Status: **pending** — populated per wave as evidence lands (see tasks.md). No implementation task may be marked complete while its row is pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| LI-001 detection fails closed to authored hints | unit (fake engines) + manual unsupported-browser check | — | pending |
| LI-002 opt-in download disclosure; evictable; never in payload | unit (state machine) + manual (network + cache inspection) | — | pending |
| LI-003 local replies pass shared validation boundary | unit (spoofed replies) | — | pending |
| LI-004 timeout budget with authored fallback | unit (timeout race, late-reply suppression) | — | pending |
| LI-005 adversarial containment; harness registration | unit (corpus replay) | — | pending |
| GB-001 player-controlled preference, authored default | unit + manual | — | pending |
| GB-002 network silence after opt-in download | manual (recorded network inspection) | — | pending |
| GB-003 accessible persisted preference; safe degradation | unit (save round-trip) + manual + a11y run | — | pending |

## Required commands

```bash
npm run check
npm test
npm run test:browser
npm run test:a11y
openspec validate on-device-guidance --strict
```

A command alone is not evidence unless its dated output or CI run is linked.

## Manual scenario notes

Recorded here with date, browser, viewport, and observed behavior when manual checks run.
