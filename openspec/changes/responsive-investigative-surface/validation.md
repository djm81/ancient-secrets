# Validation matrix: responsive-investigative-surface

Status: **in progress** — automated and iPhone Safari physical interaction evidence is recorded. Android Chrome physical validation and the full Firefox run are user-approved skips; native desktop Edge/Safari full-loop evidence and VoiceOver announcement evidence remain outstanding.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| RI-001 contextual actions preserve complete action access | unit + browser | `tests/responsive-investigative-surface.test.js`: Piazza list includes the Scriptorium transition; 2/2 passed on 2026-07-21 | automated pass; manual pending |
| RI-002 four explicit responsive modes | browser matrix + manual | Casebook mode/continuity matrix, capped desktop-portrait geometry, compact dialogue composition, and dialogue-overlay regression passed on 2026-07-22: 31 Chromium browser tests; scoped compact-dialogue checks 3/3 in Playwright WebKit and 3/3 in Firefox. The declared 8-viewport matrix passed in Chromium on 2026-07-26. | automated pass; native desktop Edge/Safari full loops pending |
| RI-003 rotation and resize preserve play state and focus | browser + manual device | Selected mirror and Casebook focus survive portrait → landscape; external focus is preserved and a Casebook-launched dialogue returns keyboard focus to its replacement action (PR #14 remediation, 2026-07-22). PR #16 remediation preserves an expanded **All observations** disclosure and its 96px Casebook scroll position through 320×568 → 667×375 rotation (2026-07-26). | automated pass; native desktop Edge/Safari full loops pending |
| RI-004 input parity and no precision/hover dependency | browser + manual keyboard/touch | `@a11y RI-004 and RI-005` keyboard action and scoped Axe; stale hotspot labels are cleared before any modal opens; `npm run test:a11y` 2/2 and `RI-004: dialogue hides a stale hotspot label` passed on 2026-07-21. On 2026-07-26, the 8-viewport matrix keyboard-selected the mirror and reported no scoped Casebook Axe violations at every declared size. | automated pass; iPhone VoiceOver focus pass, announcement evidence pending |
| RI-005 safe-area and target-size contract | browser geometry + manual device | Every visible Casebook primary control, including the **All observations** disclosure, measured ≥44×44 CSS px at every declared viewport in the 2026-07-26 Chromium matrix; portrait CSS uses `env(safe-area-inset-*)`. | automated pass; physical safe-area check pending |

## Physical iPhone Safari evidence — 2026-07-21

- Baker and Brother Matteo dialogues were checked in portrait and landscape against the LAN build.
- Compact art is used without the desktop parchment placeholder; landscape keeps art beside the dialogue copy rather than cropping it into a top banner.
- The stale `Baker’s Stall` / `Sleeping Monk` labels no longer remain over the dialogue after the modal opens.
- Remaining manual matrix: iPhone safe-area/touch/rotation coverage beyond these dialogue flows, plus Android Chrome and screen-reader checks.

## Visual browser inspection — 2026-07-26

- In a local Chromium browser, the 390 × 844 portrait tray showed the scene above the Casebook with labelled **Relevant actions** and **Travel** groups; the 1280 × 800 desktop rail remained beside a scene-forward layout with the same groups visible. On 2026-07-26, the visible **All observations** disclosure measured 366 × 44 CSS px at 390 × 844 and 268 × 44 CSS px at 1280 × 800.
- This visual check supplements the executable matrix. It is not physical-device, touch, safe-area, or screen-reader evidence.

## Physical iPhone Safari Web Inspector evidence — 2026-07-27

- Connected Safari Web Inspector to **Dom's iPhone** (iOS 26.5.2) on the deployed `djm81.github.io/ancient-secrets/maestros-secret.html` page. In portrait, the device reported a 402 × 654 CSS-pixel visual viewport at DPR 3 with reduced motion enabled.
- After the player placed the chronicle in an active scene and rotated to landscape, the device reported a 750 × 338 CSS-pixel viewport and `phone-landscape` layout. The rendered Casebook occupied `[469, 24, 255, 340]` and remained scrollable. All ten visible Casebook controls, including **All observations (6)**, measured 235 × 44 CSS px.
- The Casebook's right edge remained 26 CSS px from the device viewport edge. This is consistent with the deployed safe-area-aware placement, but does not substitute for a visual obstruction or touch-reachability assessment.
- Remaining manual matrix: VoiceOver announcement evidence and native desktop Edge/Safari full loops. Android Chrome is a user-approved skip.

## Mobile Casebook scroll remediation — 2026-07-27

- Physical iPhone finding: **All observations** expanded and its buttons worked, but scrolling was impractical because the 555px Casebook content had to fit into a 338px landscape viewport and the scroll gesture had to begin on a control.
- Root cause: `#portrait-actions` had `pointer-events: none`; only its buttons and summary opted back into hit testing, leaving no touch-active panel gutter.
- Automated remediation evidence: `RI-004: mobile Casebook exposes a touch scroll surface` failed before the fix (`pointer-events: none`) and passed after the phone-only Casebook opted into `pointer-events: auto`, `touch-action: pan-y`, and contained overscroll. The final `npm run test:browser` suite passed 41/41 and `npm run test:a11y` passed 3/3.
- Physical iPhone confirmation: the exact checked-in declarations were injected temporarily through Safari Web Inspector; with **All observations** expanded, drag-scrolling from the Casebook panel worked smoothly and a Casebook button still activated afterward. This confirms the interaction change on the device, while the deployed GitHub Pages revision remains unchanged until the workspace change is released.
- Player-confirmed iPhone full loop: the responsive Casebook flow, including contextual actions, **All observations**, travel, inventory use, dialogue, rotation, save/resume, and the repaired scroll behavior, completed on Dom's iPhone (iOS 26.5.2). This is iOS Safari evidence; it does not cover VoiceOver.
- Remaining manual matrix: VoiceOver announcement evidence and native desktop Edge/Safari full loops. Android Chrome is deferred because no device is available on 2026-07-27.

## Cross-engine automation status — 2026-07-27

- Chromium: the final full browser suite passed 41/41 after the mobile Casebook remediation and follow-up review contracts.
- Playwright WebKit: `RI-004: mobile Casebook exposes a touch scroll surface` passed 1/1. This provides WebKit-engine coverage for the repaired interaction, but is not a replacement for a native desktop Safari run.
- Playwright Firefox: the full suite is not green. Pointer clicks for the gear-flow SVG hotspots (`well`, `bread`, and `trapdoor`) are intercepted by their active scene container. This requires follow-up before Firefox can count as complete browser-engine coverage; no product-level conclusion is drawn from automation alone.

## User-approved deferred checks — 2026-07-27

- **Android Chrome physical device:** skipped because no Android device is available. The missing evidence is touch, safe-area, rotation, and TalkBack behavior on a current Android Chrome device. This does not invalidate the iPhone Safari evidence or the automated browser matrix.
- **Firefox full browser run:** skipped at the user's direction. The known blocker is Playwright Firefox pointer interception for the `well`, `bread`, and `trapdoor` SVG hotspot flows; it is a follow-up compatibility investigation, not a claim of Firefox support.

## Portrait Casebook travel separation — 2026-07-27

- Physical iPhone finding: the **Go left** / **Go right** travel controls directly abutted the preceding **All observations** control in phone portrait.
- The focused browser regression measured a 0px gap before implementation and passes with a 9px gap after the scoped `.casebook-navigation` margin change. Physical visual confirmation remains pending until this workspace revision is released.

## Casebook focused-action reveal — 2026-07-27

- VoiceOver finding: off-screen observations required a separate scroll gesture while navigating the expanded Casebook.
- The Casebook now reveals a focused button or disclosure with nearest-edge, non-animated scrolling of the Casebook itself. On iPhone Safari, the direct correction is retried across two animation frames and an 80ms settle to accommodate VoiceOver's focus scheduling.
- Physical iPhone confirmation: in landscape VoiceOver, the player moved down to lower Casebook observations and then back up through earlier observations; the right-side Casebook scrolled itself in both directions. The guidance/notes/contrast bar was also given an 8px Casebook clearance, and the lower Casebook edge retains an 18px system-gesture clearance.

Required commands: `npm run check`, `npm test`, `npm run test:browser`, `npm run test:a11y`, `git diff --check`, and `openspec validate responsive-investigative-surface --strict`.
