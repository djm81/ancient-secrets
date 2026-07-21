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

## Review remediation — PR #13

- Requirements: RI-001, RI-002, RI-003.
- Tests: Piazza complete-action parity plus desktop-portrait geometry and external-focus preservation in `tests/browser/game.spec.js`.
- Failing commands (2026-07-21, Europe/Berlin): `node --test tests/responsive-investigative-surface.test.js` and `npm run test:browser -- --grep "desktop portrait geometry|external focus"`.
- Failing results: the Piazza contract omitted `libdoor`; at 1024×1365 the 900px-capped stage rendered a 576px scene where the 16:9 height is 506.25px. The external-focus regression passed in Playwright before the fix, so the stale-focus report is addressed defensively from the review finding rather than claimed as locally reproduced.
- Implementation: add `libdoor` to `SCENE_INTERACTION_IDS.piazza`; derive desktop-portrait scene dimensions from capped stage geometry; clear remembered Casebook focus on every non-Casebook `focusin`.
- Passing evidence (2026-07-21, Europe/Berlin): `node --test tests/responsive-investigative-surface.test.js` — 2 passed; `npm run test:browser -- --grep "desktop portrait geometry|external focus|RI-002 and RI-003"` — 3 passed.

## Dialogue composition remediation

- Requirements: RI-002, RI-004.
- Manual failing evidence (2026-07-21, Europe/Berlin): physical iPhone Safari screenshots show the desktop-only baked parchment placeholder competing with the standalone portrait copy card, and the 844 × 390 layout crops the baker artwork from the top.
- Test: portrait and landscape Playwright contracts for compact dialogue art selection and non-overlapping art/copy geometry in `tests/browser/game.spec.js`.
- Failing command (2026-07-21, Europe/Berlin): `npm run test:browser -- --grep "compact dialogue"`.
- Failing result: neither dialogue surface exposed a compact layout marker, so the expected compact art and side-panel geometry were absent.
- Implementation: placeholder-free compact WebP assets under `assets/dialogue/`; `compactArt` dialogue metadata and responsive art selection in `maestros-secret.html`; phone landscape uses a side-art layout while desktop retains the existing authored parchment overlay.
- Passing evidence (2026-07-21, Europe/Berlin): `npm run test:browser -- --grep "compact dialogue"` — 2 passed; full Chromium browser suite — 29 passed; scoped compact-dialogue checks — 3 passed in Playwright WebKit and 3 passed in Firefox.
- Manual-device status: iPhone Safari has confirmed Baker and Brother Matteo portrait/landscape composition; remaining iPhone touch/safe-area/rotation breadth and all Android Chrome checks remain pending in `validation.md`.

## Dialogue overlay remediation

- Requirements: RI-002, RI-004.
- Manual failing evidence (2026-07-21, Europe/Berlin): iPhone Safari screenshots show the previously hovered scene-hotspot label persisting above the open dialogue and obscuring its artwork or choices.
- Test: `RI-004: dialogue hides a stale hotspot label` in `tests/browser/game.spec.js` opens the Baker dialogue after preserving a visible hotspot label.
- Failing command (2026-07-21, Europe/Berlin): `npm run test:browser -- --grep "dialogue hides a stale hotspot label"`.
- Failing result: the inline tag opacity remained `1` after the modal opened, instead of the required `0`.
- Implementation: `openModal` clears the hotspot label state; `#tag` sits below modal layers as a defensive fallback.
- Passing evidence (2026-07-21, Europe/Berlin): `npm run test:browser -- --grep "dialogue hides a stale hotspot label"` — 1 passed.
- Physical iPhone Safari confirmation (2026-07-21, Europe/Berlin): the user verified that the label no longer appears above the dialogue.
