# TDD evidence — interactive-dialogue-branches

All timestamps use Europe/Berlin. This change follows specification → tests → failing evidence → implementation → passing evidence.

## Initial failing baseline

- **Specification:** `specs/interactive-dialogue/spec.md`, `specs/dialogue-scene-art/spec.md`, and `specs/navigation-and-affordance-integrity/spec.md`.
- **Tests:** `tests/dialogue-and-navigation.test.js`.
- **Expected failure:** the current state has no dialogue/notes schema, no exported graph or interactable registry, no version-1 migration, and no ending eligibility functions.
- **Command and timestamp:** `2026-07-14T20:31:03+0200`, `npm test` — 20 passed, 1 failed.
- **Failure summary:** `tests/dialogue-and-navigation.test.js` cannot import `DIALOGUE_VALUES` because the current game core has no dialogue, Field Notes, scene graph, or interaction registry interfaces.
- **Implementation:** `js/game-core.js` now owns the version-2 state, migration, scene graph, interaction registry, Field Notes, and dialogue/ending transitions. `maestros-secret.html` renders accessible dialogue and notes UI, applies the graph, and prevents inactive/background SVG layers from stealing hotspot clicks.
- **Passing evidence:** `2026-07-14T20:58:43+0200`, `npm run check` passed; `npm test` passed 25/25; `npm run test:browser` passed 9/9; `npm run test:a11y` passed 1/1; `openspec validate interactive-dialogue-branches --strict` passed; `git diff --check` passed.

## Manual visual evidence

- **2026-07-14 (Europe/Berlin):** reviewed the baker dialogue at desktop and 390 × 844. The illustration, title, copy, and choices fit the 16:9 stage at both sizes after constraining mobile art to the stage rather than the viewport.
- **2026-07-14 (Europe/Berlin):** verified the Duomo Vestibule left return and post-bell right gallery arrow, the gallery return, Field Notes persistence, and final ending selection through Playwright interaction paths.

## Review regression follow-up

- **Specification:** the terminal-dialogue and migrated-bread scenarios in `specs/interactive-dialogue/spec.md`.
- **Tests:** browser coverage for Escape/focus containment in Leonardo's dialogue and a migrated version-1 bread reward.
- **Expected failure:** before the fix, Escape closes Leonardo's terminal dialogue and strands the chronicle; Tab can leave the dialogue; migrated saves with `breadTaken: true` cannot open the baker dialogue.
- **Command and timestamp:** `2026-07-14T21:04:38+0200`, `npm run test:browser` — expected to fail after the regression tests are added and before the runtime fix.
- **Observed failing result:** `2026-07-14T21:06:08+0200`, `npm run test:browser` — 9 passed, 2 failed: the migrated-bread dialogue was absent and Leonardo's enabled ending control did not receive focus.
- **Passing evidence:** `2026-07-14T21:07:16+0200`, `npm run test:browser` — 11/11 passed. The suite verifies migrated bread dialogue/no duplicate bread, enabled initial focus, Shift+Tab/Tab wrapping, Escape retention, and final ending selection. `npm run check`, `npm test` (25/25), `npm run test:a11y` (1/1), `openspec validate interactive-dialogue-branches --strict`, and `git diff --check` also passed at `2026-07-14T21:07:57+0200`.
