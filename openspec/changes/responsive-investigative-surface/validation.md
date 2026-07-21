# Validation matrix: responsive-investigative-surface

Status: **in progress** — automated implementation evidence is recorded; the physical-device matrix remains pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| RI-001 contextual actions preserve complete action access | unit + browser | `tests/responsive-investigative-surface.test.js`: Piazza list includes the Scriptorium transition; 2/2 passed on 2026-07-21 | automated pass; manual pending |
| RI-002 four explicit responsive modes | browser matrix + manual | `RI-002 and RI-003` matrix plus capped desktop-portrait scene geometry passed on 2026-07-21 | automated pass; device matrix pending |
| RI-003 rotation and resize preserve play state and focus | browser + manual device | Selected mirror and Casebook focus survive portrait → landscape; external focus regression passed and stale-focus handling is hardened on 2026-07-21 | automated pass; device matrix pending |
| RI-004 input parity and no precision/hover dependency | browser + manual keyboard/touch | `@a11y RI-004 and RI-005` keyboard action and scoped Axe; `npm run test:a11y` 2/2 passed on 2026-07-21 | automated pass; manual input checks pending |
| RI-005 safe-area and target-size contract | browser geometry + manual device | Casebook target geometry ≥44px in RI Playwright tests; portrait CSS uses `env(safe-area-inset-*)` | automated partial; physical safe-area check pending |

Required commands: `npm run check`, `npm test`, `npm run test:browser`, `npm run test:a11y`, `git diff --check`, and `openspec validate responsive-investigative-surface --strict`.
