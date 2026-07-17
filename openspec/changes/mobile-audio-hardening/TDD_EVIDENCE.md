# TDD evidence — mobile-audio-hardening

All timestamps use Europe/Berlin. This change follows specification → tests → failing evidence → implementation → passing evidence.

## iOS trusted-tap music follow-up — test evidence

- **Specification:** `specs/mobile-audio/spec.md` (MA-001 direct-tap source and control state).
- **Test to add:** with a fake suspended context whose `resume()` remains pending, start a chronicle and assert that real oscillator sources have already been scheduled by the trusted activation and that the music control reports `Starting music`.
- **Expected pre-implementation result:** no real oscillator source is created until the asynchronous resume callback runs, while the control offers no starting state.
- **Command:** `npm run test:browser -- --grep 'direct-tap music sources'`.
- **Failing baseline:** 2026-07-17 23:43 CEST — `npm run test:browser -- --grep 'direct-tap music sources'` failed as expected: a permanently pending `resume()` left real oscillator starts at `0`.
- **Implementation:** the gesture path now initializes the music graph and schedules its first bar before calling the shared resume promise. The control reports `Starting music` until the context is confirmed running, then shows `Mute music`; failures return it to `Play music` while retaining a retry request.
- **Passing result:** 2026-07-17 23:47 CEST — `npm run test:browser -- --grep 'MA-001'` passed (4/4), including the delayed-resume direct-tap scenario.
- **Final regression gates:** 2026-07-17 23:48:53 CEST — `npm run check`, `npm test` (25/25), `npm run test:browser` (21/21), `npm run test:a11y` (1/1), `npx openspec validate mobile-audio-hardening --strict`, and `git diff --check` passed.
- **Visual evidence:** 2026-07-17 23:48:53 CEST — local Chromium at 390 × 844 shows the active music glyph in the phone HUD after direct start; physical iOS output remains required release QA.

## Desktop baker-dialogue composition follow-up — test evidence

- **Specification:** `specs/mobile-gameplay/spec.md` (MG-002 desktop parchment placement).
- **Test to add:** at a 1024 × 600 desktop viewport, open the baker dialogue and assert that the copy is right-aligned within the dialogue scene while the selected dialogue image is the baker art.
- **Expected pre-implementation result:** the shared dialogue-copy rule keeps the baker copy left-aligned, covering the baker while the authored right-side parchment area remains empty.
- **Command:** `npm run test:browser -- --grep 'desktop baker dialogue copy'`.
- **Failing baseline:** 2026-07-17 23:04:21 CEST — failed as expected: copy left `66.265625` was below the required `492.74125` (48% of the dialogue-scene width), leaving the Baker's authored right-side parchment area empty.
- **Implementation:** set `data-encounter` in `openDialogue()` and apply a Baker-only desktop rule which anchors `.dialogue-copy` to the right; compact/mobile viewports retain the in-flow rule.
- **Passing result:** 2026-07-17 23:05:08 CEST — `npm run test:browser -- --grep 'desktop baker dialogue copy'` passed (1/1).
- **Visual evidence:** 2026-07-17 23:10:28 CEST — settled-state screenshots at 1024 × 600 and 390 × 844 confirm that desktop copy occupies the lower-right parchment panel and the phone copy remains beneath the image.
- **Final regression gates:** 2026-07-17 23:10:28 CEST — `npm run check`, `npm test` (25/25), `npm run test:browser` (20/20), `npm run test:a11y` (1/1), `npx openspec validate mobile-audio-hardening --strict`, and `git diff --check` passed.

## iOS audio, first-time assistant, and responsive-dialogue follow-up — test design

- **Specifications:** `specs/mobile-audio/spec.md` (MA-001 non-running resume), `specs/first-time-assistant/spec.md` (FTA-001), and `specs/mobile-gameplay/spec.md` (MG-002 short-viewport dialogue).
- **Tests to add:** a fake `AudioContext` whose first resume resolves while remaining suspended, new/start/dismiss/continue onboarding checks, and a short landscape dialogue action-bounds check.
- **Expected pre-implementation result:** the audio control remains marked enabled after a resolved-but-suspended context, no assistant dialog exists, and dialogue action bounds are not explicitly protected at a short landscape viewport.
- **Command:** `npm run test:browser -- --grep 'MA-001: an iOS-style|FTA-001|MG-002: short portrait'`.
- **Status:** baseline recorded below.

## iOS audio, first-time assistant, and responsive-dialogue follow-up — baseline and passing evidence

- **Failing baseline:** `2026-07-17` (Europe/Berlin), `npm run test:browser -- --grep 'MA-001: an iOS-style|FTA-001|MG-002: short portrait'` — 0/3 passed before implementation. The assistant dialog was absent, short-viewport dialogue copy stayed absolutely positioned, and a resume promise that resolved while the fake context remained suspended incorrectly marked music as enabled.
- **Implementation:** audio activation now primes a zero-length buffer on the player gesture, treats `AudioContext.state === 'running'` as the only successful unlock, and retains a requested-play retry for later gestures. A local-storage-backed first-chronicle assistant explains inspection, satchel use, and travel, then returns focus to the hand-mirror interaction. Short landscape dialogue keeps its copy in normal flow and bounds its image so choices stay reachable.
- **Passing targeted evidence:** `2026-07-17` (Europe/Berlin), `npm run test:browser -- --grep 'MA-001: an iOS-style|FTA-001|MG-002: short portrait'` — 3/3 passed.
- **Passing regression evidence:** `2026-07-17` (Europe/Berlin), `npm run check`, `npm test` (25/25), `npm run test:browser` (19/19), `npm run test:a11y` (1/1), `npx openspec validate mobile-audio-hardening --strict`, and `git diff --check` — passed.
- **Manual evidence:** `2026-07-17` (Europe/Berlin), local Chromium screenshots inspected at 390 × 844 (first-time assistant), 844 × 390 (workshop interaction/dialogue layout), and 1440 × 900 (desktop scene). Physical iOS audio output remains release QA because this environment has no physical iOS audio device.

## Failing baseline

- **Specifications:** `specs/mobile-gameplay/spec.md` (MG-001, MG-002) and `specs/mobile-audio/spec.md` (MA-001).
- **Tests:** new Playwright portrait action/dialogue checks and a fake suspended-AudioContext check in `tests/browser/game.spec.js`.
- **Expected failure before implementation:** the current stage remains 16:9 and 219 px high at 390 px wide, no portrait action surface exists, dialogue shrinks controls to 8 px, and `musicStart()` schedules bars before an asynchronous context resume is confirmed.
- **Command/timestamp:** `2026-07-15T22:00:10+02:00`, `npm run test:browser -- --grep 'MG-|MA-001'`.
- **Observed failing result:** the first two added scenarios failed because `#portrait-actions` did not exist. The command exited non-zero before its final summary; the static pre-change audio path scheduled `ping()` oscillators immediately and called `ctx.resume()` without waiting in `musicStart()`.

## Passing evidence

- **Implementation:** `maestros-secret.html` now expands the stage for portrait phones, presents the existing visible hotspots and declared navigation as touch-sized native controls, and uses readable, in-flow dialogue copy. Its audio helpers wait for a suspended context to resume before scheduling effects or music; a rejected resume returns the music control to muted without affecting gameplay.
- **Automated:** `2026-07-15T22:02:41+02:00`, `npm run test:browser -- --grep 'MG-|MA-001'` — 3/3 passed. Final regression at `2026-07-15T22:06:32+02:00`, `npm run test:browser` — 14/14 passed; `npm run test:a11y` — 1/1 passed. `npm run check`, `npm test` (25/25), `npx openspec validate mobile-audio-hardening --strict`, and `git diff --check` passed at `2026-07-15T22:06:15+02:00`.
- **Manual visual evidence:** `2026-07-15` (Europe/Berlin), local Chromium screenshots inspected at 390 × 844 and 1440 × 900. Portrait shows the full 16:9 scene, touch-sized mirror/navigation controls, and a complete baker dialogue with readable text and choices; desktop retains the full-scene layout. Hardware-device audio playback remains to be checked on a physical phone.

## Review follow-up — pending failing evidence

- **Review thread:** `PRRT_kwDOTW1Bac6RPF53`, `maestros-secret.html:1303` — the delayed flying-machine transition did not rebuild the portrait action surface after it made the trapdoor visible.
- **Specification:** `specs/mobile-gameplay/spec.md` — “A delayed puzzle reveal adds its portrait action.”
- **Test:** portrait-playwright regression in `tests/browser/game.spec.js`.
- **Expected failing result:** the Trapdoor action remains absent after the transition because the surface is rebuilt before the nested reveal timeout completes.
- **Command/timestamp:** `2026-07-15T22:41:07+02:00`, `npm run test:browser -- --grep 'delayed trapdoor reveal'`.
- **Observed failing result:** 0/1 passed. The Trapdoor button was not found within 4 seconds after Flying Machine interaction.
- **Implementation:** the final machine-repair timeout now calls `renderPortraitActions()` immediately after exposing `#trapdoor`.
- **Passing evidence:** `2026-07-15T22:41:36+02:00`, `npm run test:browser -- --grep 'delayed trapdoor reveal'` — 1/1 passed.
- **Regression gates:** `2026-07-15T22:42:09+02:00`, `npm run test:browser` — 15/15 passed; `npm run test:a11y` — 1/1 passed. `npm run check`, `npm test` (25/25), `npx openspec validate mobile-audio-hardening --strict`, and `git diff --check` passed at `2026-07-15T22:41:50+02:00`.

## Review follow-up — suspended scheduler

- **Review thread:** `PRRT_kwDOTW1Bac6RPUt0`, `maestros-secret.html:1039` — `mLoop()` returned when a previously running context became suspended, leaving no future scheduler timeout.
- **Specification:** `specs/mobile-audio/spec.md` — “A running context is later suspended.”
- **Test:** lifecycle-suspension browser regression in `tests/browser/game.spec.js`.
- **Expected failing result:** after the fake context is suspended and then returns to running, no additional oscillator starts occur because the scheduler was not re-queued.
- **Test correction:** the first draft observed the delayed pickup effect rather than a resumed music bar. The regression now waits for that authored effect before suspending the context.
- **Command/timestamp:** `2026-07-15T22:52:36+02:00`, `npm run test:browser -- --grep 'later context suspension'`.
- **Observed failing result:** 0/1 passed. After the fake context resumed, oscillator starts remained at 22 for five seconds; `mLoop()` had returned without scheduling another timeout.
- **Implementation:** while music remains enabled and the context is suspended, `mLoop()` schedules its next check instead of returning permanently.
- **Passing evidence:** `2026-07-15T22:53:17+02:00`, `npm run test:browser -- --grep 'later context suspension'` — 1/1 passed.
- **Regression gates:** `2026-07-15T22:53:55+02:00`, `npm run test:browser` — 16/16 passed; `npm run test:a11y` — 1/1 passed. `npm run check`, `npm test` (25/25), `npx openspec validate mobile-audio-hardening --strict`, and `git diff --check` passed at `2026-07-15T22:53:40+02:00`.
