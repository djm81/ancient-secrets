# Validation evidence matrix

| Requirement | Automated evidence | Manual evidence | Status | Evidence |
| --- | --- | --- | --- | --- |
| ID-001 Dialogue choice and ending state | Unit + Playwright dialogue tests | Keyboard focus wrap, Escape retention, and final resolution review | Passed locally | `npm test` 25/25; `npm run test:browser` 11/11; `npm run test:a11y` 1/1, 2026-07-14 |
| ID-002 Version-1 migration and safe rejection | Unit save tests + migrated-bread browser test | Continue Chronicle smoke test | Passed locally | `npm test` 25/25; `npm run test:browser` 11/11, 2026-07-14 |
| DA-001 Original local dialogue art | Local asset/manifest review | Desktop and 390 × 844 visual review | Passed locally | `assets/dialogue/ART_MANIFEST.md`; visual QA, 2026-07-14 |
| NA-001 Valid navigation graph | Unit graph + Playwright traversal | Workshop, Piazza, Duomo, gallery review | Passed locally | `npm run test:browser` 9/9, 2026-07-14 |
| NA-002 Meaningful marked interactables | DOM registry contract test | Field Notes and puzzle audit | Passed locally | `npm test` 25/25; `npm run test:browser` 9/9, 2026-07-14 |

## Required commands

```bash
npm run check
npm test
npm run test:browser
npm run test:a11y
openspec validate interactive-dialogue-branches --strict
git diff --check
```
