# Validation matrix: on-device-guidance

Status: **pending** — populated per wave as evidence lands (see tasks.md). No implementation task may be marked complete while its row is pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| LI-001 browser-native detection fails closed without app-initiated loading | unit (Prompt API fakes + import/request spy) + manual unsupported-browser check | — | pending |
| LI-002 explicit activation disclosure; no app-requested assets or payload weights | unit (state machine) + manual network inspection | — | pending |
| LI-003 local replies pass shared validation boundary | unit (spoofed replies) | — | pending |
| LI-004 timeout budget with authored fallback | unit (timeout race, late-reply suppression) | — | pending |
| LI-005 adversarial containment; harness registration | unit (corpus replay) | — | pending |
| GB-001 player-controlled preference, authored default | unit + manual | — | pending |
| GB-002 network silence after browser-native opt-in | manual (recorded network inspection) | — | pending |
| GB-003 accessible persisted preference; safe degradation | unit (save round-trip) + manual + a11y run | — | pending |
| GB-004 ordered save migration preserves sibling fields | unit (v2 and both migration orders) + browser resume check | — | pending |
| TM-003 baseline threat model prerequisite and local-inference update | documented review of `docs/ai-threat-model.md` before implementation | — | pending |

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
