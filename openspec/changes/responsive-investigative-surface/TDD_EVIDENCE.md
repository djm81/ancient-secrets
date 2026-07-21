# TDD evidence: responsive-investigative-surface

Status: **in progress** — Wave A has started.

For each task record: requirement IDs, test and command, dated failing evidence, implementation reference, dated passing evidence, and any manual-device exception.

## A1 — contextual Casebook contract

- Requirement: RI-001.
- Test: `tests/responsive-investigative-surface.test.js` covers the three-action relevance cap, complete-action fallback, and interaction-ID parity.
- Failing command (2026-07-21, Europe/Berlin): `node --test tests/responsive-investigative-surface.test.js`.
- Failing result: `SyntaxError: ... does not provide an export named 'deriveContextualActions'`.
- Implementation: `SCENE_INTERACTION_IDS` and `deriveContextualActions` in `js/game-core.js`; Casebook rendering in `maestros-secret.html` uses those IDs for both contextual actions and All observations.
- Passing evidence (2026-07-21, Europe/Berlin): `node --test tests/responsive-investigative-surface.test.js` — 2 passed.

## A3 — responsive mode and continuity contract

- Requirements: RI-002, RI-003.
- Test: `RI-002 and RI-003: Casebook modes and item focus survive viewport changes` in `tests/browser/game.spec.js`.
- Failing command (2026-07-21, Europe/Berlin): `npm run test:browser -- --grep RI-002`.
- Failing result: after 390×844 → 844×390, `toBeFocused()` failed for the corresponding Casebook note action; selected inventory state remained intact.
- Implementation: `responsiveLayoutMode`, `visualViewport`/viewport event handling, and logical Casebook focus restoration in `maestros-secret.html`.
- Passing evidence (2026-07-21, Europe/Berlin): `npm run test:browser -- --grep RI-002` — 1 passed.

## B — surface and accessibility evidence

- Requirements: RI-004, RI-005.
- Automated evidence (2026-07-21, Europe/Berlin): `npm run test:a11y` — 2 passed; Casebook keyboard activation, 44px target geometry, and scoped Axe checks are covered by `@a11y RI-004 and RI-005`.
- Manual device exception: current iOS Safari and Android Chrome safe-area, touch, screen-reader, and contrast checks remain pending in `validation.md`; they require physical devices and are not represented as complete.
