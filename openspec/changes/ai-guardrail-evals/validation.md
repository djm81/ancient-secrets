# Validation matrix: ai-guardrail-evals

Status: **pending** — populated per wave as evidence lands (see tasks.md). No implementation task may be marked complete while its row is pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| GR-001 no state mutation from model output | unit (state immutability under spoofed replies) | — | pending |
| GR-002 deterministic validator, discard-not-repair | unit | — | pending |
| GR-003 authored fallback progression-equivalence | unit + manual full-run without AI | — | pending |
| GR-004 fail-closed configuration | unit (worker 503 paths) | — | pending |
| GR-005 allowlisted model-visible schema | unit (extra-key rejection) | — | pending |
| GR-006 adversarial scenarios per AI capability | process (matrix review) + AE-005 harness rule | — | pending |
| AE-001 corpus covers every model-visible field | unit (corpus completeness sweep) | — | pending |
| AE-002 offline replay gating in default CI | CI run without network/secrets | — | pending |
| AE-003 hallucination rejection | unit | — | pending |
| AE-004 spoiler/tier-appropriateness checks | unit (seeded runs) | — | pending |
| AE-005 surface registration with non-empty corpus | unit (harness failure case) | — | pending |
| LM-001 manual dispatch, secret-free transcripts | workflow run + transcript inspection | — | pending |
| LM-002 model swap gated on committed evaluation | process + dated transcript link | — | pending |
| LM-003 evaluations advisory to Pages deploy | workflow configuration review | — | pending |

## Required commands

```bash
npm run check
npm test
npm run test:browser
npm run test:a11y
openspec validate ai-guardrail-evals --strict
```

A command alone is not evidence unless its dated output or CI run is linked.

## Manual scenario notes

Recorded here with date, browser, viewport, and observed behavior when manual checks run.
