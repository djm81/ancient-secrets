# TDD evidence — mobile-audio-hardening

All timestamps use Europe/Berlin. This change follows specification → tests → failing evidence → implementation → passing evidence.

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
