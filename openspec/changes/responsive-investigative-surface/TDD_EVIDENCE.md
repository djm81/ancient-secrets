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

## B2 — declared viewport accessibility matrix

- Requirements: RI-002, RI-004, RI-005.
- Test to add: an eight-viewport Playwright matrix covering the declared 320×568, 390×844, 430×932, 667×375, 844×390, 1024×1365, 1280×800, and 1440×900 sizes. It will require the expected layout mode, keyboard activation of a contextual Casebook action, a 44×44 CSS-pixel minimum target, visible high-contrast state, reduced-motion media support, and no scoped Casebook Axe violations.
- Failing baseline (2026-07-26, Europe/Berlin): the test did not exist; the existing RI accessibility contract covered only 390×844, so the full declared matrix had no executable evidence.
- Command: `npm run test:browser -- --grep "viewport accessibility matrix"`.
- Expected result before implementation: no matching tests, which establishes the missing matrix coverage rather than a product failure.
- Failing result (2026-07-26, Europe/Berlin): after the matrix test was added, it failed at the short landscape viewport with Axe `aria-prohibited-attr` (serious): the empty `.casebook-navigation` `div` had `aria-label="Travel"` but no semantic role.
- Implementation: each labelled Casebook section in `renderPortraitActions` now has the semantic `group` role, so its accessible name is permitted in both populated and empty states.
- Passing evidence (2026-07-26, Europe/Berlin): `npm run test:browser -- --grep "viewport accessibility matrix"` — 1/1 passed across all eight declared viewports; it verifies the expected layout, keyboard mirror selection, ≥44×44 CSS-pixel control geometry, high contrast, reduced motion, and scoped Axe results.
- Manual-device exception: browser emulation cannot establish iOS/Android safe-area behavior, physical touch behavior, or screen-reader announcements. Those rows remain pending in `validation.md`.

## GC-001 — gear-to-trapdoor player flow verification

- Regression reported on the deployed game: after earning the Bronze Gear, the player could not reliably install it in the Flying Machine and reveal the trapdoor.
- Test to add: a Playwright flow for each authored gear route (well and lion): earn the gear with selected bread, select the rendered Bronze Gear in the satchel, travel to the workshop, activate the Flying Machine, immediately refresh, resume, and require the trapdoor to be visible.
- Failing baseline (2026-07-26, Europe/Berlin): no end-to-end test exercised the complete reward → select → travel → install → refresh flow. Existing tests covered reward persistence and an already-selected gear repair independently.
- Command: `npm run test:browser -- --grep "gear-to-trapdoor"`.
- Expected result before implementation: no matching test, which establishes the missing integration coverage. No code change is presumed until the test provides contrary evidence.
- Test refinement: the first version seeded an incomplete version-2 save, which the save validator correctly rejected; the second attempted a pointer click on the continuously swaying decorative machine, which Playwright correctly treats as unstable. The final test uses a valid migrated version-1 save and activates the same focusable machine control with Enter.
- Passing evidence (2026-07-26, Europe/Berlin): `npm run test:browser -- --grep "gear-to-trapdoor"` — 1/1 passed. Both well and lion reward routes retained the selected gear through travel, installed it in the Flying Machine, persisted the state immediately, and restored a visible trapdoor after refresh.

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

## Review remediation — PR #14 Casebook modal return focus

- Requirement: RI-003, RI-004.
- Test: `RI-003 and RI-004: a Casebook action restores focus after closing its modal` in `tests/browser/game.spec.js` opens and closes the Baker dialogue from its Casebook action, then requires focus on its replacement action.
- Failing command (2026-07-22, Europe/Berlin): `npm run test:browser -- --grep "Casebook action restores focus"`.
- Failing result: focus restoration was skipped because the clicked Casebook button was disconnected by `renderPortraitActions` before the dialogue closed.
- Implementation: `openModal` records the Casebook interaction ID; `closeModal` restores focus to the replacement action when the original trigger no longer exists.
- Passing evidence (2026-07-22, Europe/Berlin): `npm run test:browser -- --grep "Casebook action restores focus"` — 1 passed.
