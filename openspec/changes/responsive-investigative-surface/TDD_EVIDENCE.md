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

## B2 remediation — mobile Casebook touch scrolling

- Requirements: RI-004, RI-005.
- Reported physical failure (2026-07-27, Europe/Berlin): on Dom's iPhone (iOS 26.5.2), **All observations** expanded and its buttons worked, but the 555px Casebook content could not be reliably dragged through its 338px landscape viewport because the drag had to begin on a control.
- Failing test to add: a phone-landscape browser contract will require `#portrait-actions` to expose a hit-testable vertical pan surface while the disclosure is expanded, without changing desktop layout behavior.
- Command: `npm run test:browser -- --grep "touch scroll surface"`.
- Expected failure before implementation: computed `pointer-events` is `none` on the mobile Casebook (only its buttons and summary opt back in), leaving no touch-active gutter for a scroll gesture.
- Failing result (2026-07-27, Europe/Berlin): `RI-004: mobile Casebook exposes a touch scroll surface` failed with expected `pointer-events: auto`, received `none`; the panel had 555px `scrollHeight` in a 338px `clientHeight` viewport.
- Implementation: mobile portrait and landscape Casebooks opt into `pointer-events: auto`, `touch-action: pan-y`, and contained overscroll; the desktop overlay remains transparent to scene input.
- Passing evidence (2026-07-27, Europe/Berlin): `npm run test:browser -- --grep "touch scroll surface"` — 1/1 passed; `npx playwright test --browser=webkit --grep "touch scroll surface"` — 1/1 passed. The regression waits for responsive layout to settle after the desktop resize before asserting the desktop hit-testing contract.
- Physical confirmation (2026-07-27, Europe/Berlin): the same declarations were injected temporarily through Safari Web Inspector on Dom's iPhone. With **All observations** expanded, the player could drag-scroll the Casebook smoothly and then activate a Casebook button. The temporary style is cleared by reload; the checked-in CSS is the deployable implementation.

## B2 follow-up — portrait Casebook travel separation

- Requirements: RI-004, RI-005.
- Reported physical failure (2026-07-27, Europe/Berlin): in phone portrait, the **Go left** and **Go right** travel controls visually touch the preceding **All observations** disclosure because the travel group has no top separation.
- Failing test to add: the portrait Casebook contract will require an 8px-or-greater vertical gap between the final disclosure/control and the travel group.
- Command: `npm run test:browser -- --grep "portrait travel controls retain Casebook separation"`.
- Expected failure before implementation: the measured gap is 0px.
- Failing result (2026-07-27, Europe/Berlin): the new portrait regression received a 0px gap where ≥8px is required.
- Implementation: `.casebook-navigation` now has a 9px top margin, separating travel controls from the preceding disclosure or observation control without changing the controls' 44px target-size contract.
- Passing evidence (2026-07-27, Europe/Berlin): `npm run test:browser -- --grep "portrait travel controls retain Casebook separation"` — 1/1 passed.

## B2 follow-up — Casebook focused-action reveal

- Requirements: RI-003, RI-004.
- Reported physical accessibility gap (2026-07-27, Europe/Berlin): with VoiceOver enabled, advancing to an off-screen Casebook observation requires a separate scroll gesture instead of revealing the focused action.
- Failing test to add: at a short phone-portrait viewport, programmatic focus with native scrolling suppressed will require the Casebook surface to scroll enough to reveal the final expanded observation.
- Command: `npm run test:browser -- --grep "focused Casebook observation is revealed"`.
- Expected failure before implementation: `scrollTop` remains 0 after focus because the global focus handler records the action but does not reveal it.
- Failing result (2026-07-27, Europe/Berlin): the focused target remained hidden with `scrollTop: 0` after `focus({ preventScroll: true })`.
- Implementation: when a Casebook button or disclosure receives focus, the existing capture-phase focus handler calculates its overflow relative to `#portrait-actions` and changes that element's `scrollTop` directly. This reveals the control without smooth animation and preserves the remembered Casebook focus ID.
- Passing evidence (2026-07-27, Europe/Berlin): `npm run test:browser -- --grep "focused Casebook observation is revealed"` — 1/1 passed. The final expanded observation is revealed within the scroll surface, allowing 1 CSS pixel for border/sub-pixel rounding.
- Physical-device timing refinement (2026-07-27, Europe/Berlin): the iPhone VoiceOver probe confirmed that landscape navigation emits DOM `focusin` events for Casebook controls, but the one-frame reveal did not move the visible panel reliably. This is an iOS accessibility-focus scheduling distinction that Playwright does not reproduce, so the follow-up uses a second animation-frame reveal and is validated through the same focused regression plus the connected device; no artificial red browser baseline is claimed.
- Physical-device containment refinement (2026-07-27, Europe/Berlin): the iPhone revealed that `scrollIntoView()` can stop after scrolling the outer document instead of the right-side landscape Casebook. The follow-up will calculate the focused control's overflow relative to `#portrait-actions` and change that element's `scrollTop` directly. Browser emulation already scrolls the nearest container correctly, so the physical evidence is the justified failing baseline; the regression adds an explicit landscape inner-scroll/no-page-scroll contract.
- Physical-device event-phase refinement (2026-07-27, Europe/Berlin): the VoiceOver probe observed landscape `focusin` events in capture phase while the bubble-phase reveal still failed to move the panel. The reveal listener now runs in capture phase; browser automation exercises the same focus contract but cannot reproduce iOS accessibility-event propagation.

## B2 follow-up — landscape Casebook system-gesture clearance

- Requirements: RI-004, RI-005.
- Reported physical failure (2026-07-27, Europe/Berlin): in landscape VoiceOver navigation reached the lower Casebook edge, where a further upward gesture could be intercepted by iOS system navigation rather than continue within the right-side panel.
- Failing test to add: the phone-landscape Casebook must retain at least 16 CSS px between its bottom edge and the viewport, before any larger device safe-area inset is applied.
- Command: `npm run test:browser -- --grep "landscape Casebook clears the system gesture edge"`.
- Expected failure before implementation: the Casebook bottom gap is 6px.

## B2 follow-up — landscape Casebook top-bar clearance

- Requirements: RI-004, RI-005.
- Reported physical failure (2026-07-27, Europe/Berlin): after the lower safe-edge remediation, the Casebook could scroll down on the iPhone in landscape but upward movement was obstructed at its top edge by the guidance, notes, and contrast controls.
- Failing test: phone-landscape Casebook must begin at least 8 CSS px below the rendered top bar.
- Command: `npm run test:browser -- --grep "landscape Casebook clears the top-bar controls"`.
- Expected failure before implementation: the Casebook starts at 56px while the wrapped top bar ends at 72px, producing a 16px overlap.
- Failing result (2026-07-27, Europe/Berlin): expected a top clearance of at least 8px; received `-16px`.
- Implementation and passing evidence (2026-07-27, Europe/Berlin): the Casebook now begins at `max(80px, calc(64px + env(safe-area-inset-top)))`, while retaining the 18px bottom clearance. `npm run test:browser -- --grep "landscape Casebook clears the top-bar controls|landscape Casebook clears the system gesture edge|landscape Casebook focus scrolls the panel"` — 3/3 passed.

## B2 follow-up — landscape Casebook upward focus reveal

- Requirements: RI-003, RI-004.
- Reported physical failure (2026-07-27, Europe/Berlin): after the Casebook has moved down in landscape VoiceOver, moving focus back toward earlier observations does not reliably scroll the Casebook upward. The top-bar clearance change did not resolve it.
- Browser-contract exception: the existing landscape focus contract already verifies that direct `scrollTop` moves the inner Casebook without scrolling the page, in both directions in browser engines. The failure is iOS VoiceOver's post-focus scheduling, which browser automation cannot reproduce. The physical-device report is therefore the justified failing baseline.
- Implementation to validate: repeat the direct overflow correction on two animation frames and once after a short 80ms settle, so a late iOS focus adjustment cannot cancel an upward correction.
- Passing evidence (2026-07-27, Europe/Berlin): `npm run test:browser -- --grep "focused Casebook observation is revealed|landscape Casebook focus scrolls the panel"` — 2/2 passed. On Dom's iPhone through Safari Web Inspector, VoiceOver can now move focus down to lower Casebook observations and back up through earlier ones while the right-side Casebook scrolls itself in both directions.

## B2 review remediation — complete-action disclosure target size

- Review thread: PR #15 `PRRT_kwDOTW1Bac6T4xyy` (unresolved; 2026-07-26).
- Requirements: RI-005.
- Failing test to add: the declared viewport matrix will measure every visible Casebook primary control, including the **All observations** disclosure, and require each to be at least 44×44 CSS px.
- Failing baseline (2026-07-26, Europe/Berlin): the existing matrix measured only the contextual Hand Mirror control. The disclosure had an 11px font and no minimum height, so it was not proven to meet the touch-target contract.
- Command: `npm run test:browser -- --grep "viewport accessibility matrix"`.
- Expected failure before implementation: the disclosure height is below 44 CSS px at the tested viewports.
- Failing result (2026-07-26, Europe/Berlin): the new matrix measured the disclosure at 15 CSS px high.
- Implementation: `.casebook-all summary` is now a flex control with `min-height:44px`; the matrix measures every visible `.portrait-action` and the disclosure while excluding collapsed controls with zero geometry.
- Passing evidence (2026-07-26, Europe/Berlin): `npm run test:browser -- --grep "viewport accessibility matrix"` — 1/1 passed across all eight declared viewports.

## Release PR #16 review remediation — manual dispatch and Casebook continuity

- Review feedback: PR #16 comment `IC_kwDOTW1Bac8AAAABLxoFxQ` (unresolved; 2026-07-26).
- Requirements: archived CQ-001 workflow dispatch contract; RI-003 reachable-scroll continuity.
- Failing tests to add: the workflow contract will require `workflow_dispatch` to use a non-empty first-parent base SHA; a browser rotation test will expand **All observations**, scroll its Casebook surface, rotate to phone landscape, and require both the disclosure and scroll position to survive.
- Commands: `npm test`; `npm run test:browser -- --grep "disclosure and scroll"`.
- Expected failures before implementation: workflow contract has no manual-dispatch fallback; the rotation test replaces the `<details>` control and resets it closed with scroll position 0.
- Failing results (2026-07-26, Europe/Berlin): `npm test` failed the CQ-001 contract because no `workflow_dispatch` fallback existed; the focused browser test observed a replaced disclosure without `open` after 320×568 → 667×375 rotation.
- Implementation: manual dispatches now use `${{ github.sha }}^` as the submitted-diff base; the Casebook records disclosure state and scroll position as they change, then restores that recorded view state after responsive re-rendering. The regression waits for its programmatic scroll event to reach the Casebook state recorder before simulating rotation, matching a completed user scroll rather than racing a synthetic assignment.
- Passing evidence (2026-07-26, Europe/Berlin): `npm test` — 28/28 passed; `npm run test:browser -- --grep "Casebook disclosure and scroll position survive rotation"` — 1/1 passed; full `npm run test:browser` — 34/34 passed; `npm run test:a11y` — 3/3 passed.

## Release PR #16 CodeRabbit review remediation — evidence precision

- Review threads: `PRRT_kwDOTW1Bac6T46G9`, `PRRT_kwDOTW1Bac6T49hv`, and `PRRT_kwDOTW1Bac6T49hw` (unresolved; 2026-07-26).
- Requirements: RI-005 target-size evidence; archived CQ-001 workflow-dispatch contract; release evidence traceability.
- Tests to strengthen: the viewport matrix will assert the **All observations** summary directly before skipping zero-geometry controls inside collapsed content; the workflow contract will capture the `on` trigger block and the submitted-diff-base step before asserting the dispatch fallback.
- Failing-baseline exception (2026-07-26, Europe/Berlin): these findings identify missing assertion precision, not a demonstrated product failure. The existing UI and workflow already satisfy the requested behavior, so a red product test is neither expected nor manufactured; the previous tests were insufficiently specific.
- Validation commands: `npm test`; `npm run test:browser -- --grep "viewport accessibility matrix"`; full required gates after implementation.
- Implementation: the matrix now proves the disclosure's own visibility and 44px geometry before retaining the collapsed-action skip; the workflow test scopes `workflow_dispatch` to the trigger block and its SHA fallback to the submitted-diff-base step. The release record now explains the count change.
- Passing evidence (2026-07-26, Europe/Berlin): `npm test` — 28/28 passed; `npm run test:browser -- --grep "viewport accessibility matrix"` — 1/1 passed.
- Browser-count clarification: the PR description's 33-test figure predates commit `da36f41`, which added the RI-003 Casebook-rotation regression. The current full Chromium suite contains that additional test and therefore correctly reports 34/34.
- Required-gate evidence (2026-07-26, Europe/Berlin): `npm run check`; `npm test` — 28/28; `npm run test:browser` — 34/34; `npm run test:a11y` — 3/3; `openspec validate responsive-investigative-surface --strict`; and `git diff --check` all passed.

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
