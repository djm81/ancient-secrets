# Validation matrix: local-npc-conversation

Status: **pending** — populated per wave as evidence lands (see tasks.md). No implementation task may be marked complete while its row is pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| NC-001 fixed-choice parity and completeness | unit (effect-set comparison) + browser test | — | pending |
| NC-002 player text never transmitted or persisted | unit (lifetime) + manual (network + save inspection) | — | pending |
| NC-003 length-capped flavor, authored deflection fallback | unit | — | pending |
| NC-004 field gated on local-inference opt-in; graceful degradation | browser test + manual | — | pending |
| IB-001 enum is the sole state channel | unit | — | pending |
| IB-002 schema constraint + state re-validation | unit | — | pending |
| IB-003 jailbreaks cannot alter progression (3 scenarios) | unit (recorded outputs) + manual live red-team session | — | pending |
| IB-004 boundary unit-testable without a model | CI run (offline replay) | — | pending |
| SF-001 lexical filter both directions with deflections | unit | — | pending |
| SF-002 no conversation content in any egress/persistence surface | unit + manual inspection | — | pending |
| SF-003 red-team corpus registered with harness | unit (registry sweep) | — | pending |
| TM-003 baseline threat model prerequisite and conversation update | documented review of `docs/ai-threat-model.md` before implementation | — | pending |

## Required commands

```bash
npm run check
npm test
npm run test:browser
npm run test:a11y
openspec validate local-npc-conversation --strict
```

A command alone is not evidence unless its dated output or CI run is linked.

## Manual scenario notes

Recorded here with date, browser, viewport, and observed behavior when manual checks run — including the live red-team session transcript summary for IB-003.
