# Validation matrix: responsive-investigative-surface

Status: **in progress** — automated implementation evidence is recorded; the physical-device matrix remains pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| RI-001 contextual actions preserve complete action access | unit + browser | `tests/responsive-investigative-surface.test.js`: Piazza list includes the Scriptorium transition; 2/2 passed on 2026-07-21 | automated pass; manual pending |
| RI-002 four explicit responsive modes | browser matrix + manual | Casebook mode/continuity matrix, capped desktop-portrait geometry, compact dialogue composition, and dialogue-overlay regression passed on 2026-07-22: 31 Chromium browser tests; scoped compact-dialogue checks 3/3 in Playwright WebKit and 3/3 in Firefox | automated pass; device matrix pending |
| RI-003 rotation and resize preserve play state and focus | browser + manual device | Selected mirror and Casebook focus survive portrait → landscape; external focus is preserved and a Casebook-launched dialogue returns keyboard focus to its replacement action (PR #14 remediation, 2026-07-22) | automated pass; device matrix pending |
| RI-004 input parity and no precision/hover dependency | browser + manual keyboard/touch | `@a11y RI-004 and RI-005` keyboard action and scoped Axe; stale hotspot labels are cleared before any modal opens; `npm run test:a11y` 2/2 and `RI-004: dialogue hides a stale hotspot label` passed on 2026-07-21 | automated pass; manual input checks pending |
| RI-005 safe-area and target-size contract | browser geometry + manual device | Casebook target geometry ≥44px in RI Playwright tests; portrait CSS uses `env(safe-area-inset-*)` | automated partial; physical safe-area check pending |

## Physical iPhone Safari evidence — 2026-07-21

- Baker and Brother Matteo dialogues were checked in portrait and landscape against the LAN build.
- Compact art is used without the desktop parchment placeholder; landscape keeps art beside the dialogue copy rather than cropping it into a top banner.
- The stale `Baker’s Stall` / `Sleeping Monk` labels no longer remain over the dialogue after the modal opens.
- Remaining manual matrix: iPhone safe-area/touch/rotation coverage beyond these dialogue flows, plus Android Chrome and screen-reader checks.

Required commands: `npm run check`, `npm test`, `npm run test:browser`, `npm run test:a11y`, `git diff --check`, and `openspec validate responsive-investigative-surface --strict`.
