# Tasks: installable-offline-web-app

## Wave 0 — proposal stage

- [x] 0a. Confirm the GitHub Pages deployment path, supported browser/device matrix, and cache-size budget; run `openspec validate installable-offline-web-app --strict`. The project deployment path is `https://djm81.github.io/ancient-secrets/`; the current core shell is about 2.6 MiB before browser HTTP compression; strict validation passed on 2026-07-29.

## Wave A — app identity and offline shell

- [x] A1. Create failing tests for manifest identity, relative scope/start route, icons, standalone display, and local font references; implement manifest/head/icon/font assets; record evidence. `node --test tests/installable-offline-web-app.test.js` failed 0/1 before implementation because `manifest.webmanifest` was absent, then passed 1/1 on 2026-07-29.
- [x] A2. Create failing service-worker tests for core precache list, GET-only handling, offline navigation, and explicit exclusion of POST/AI/model requests; implement; record evidence. `tests/offline-shell.test.js` passed on 2026-07-29.
- [x] A3. Add offline browser tests: successful first online launch followed by offline launch, resume, and authored guidance; record evidence. The initial focused checkpoint passed 2/2 on 2026-07-29; the final focused suite passed 3/3 after Cache Storage and console assertions were added.

## Wave B — lifecycle and recovery

- [x] B1. Create failing tests for waiting updates and no reload during an active chronicle; implement restart handoff; record evidence. The lifecycle contract verifies a waiting worker, explicit `SKIP_WAITING`, and conditional reload only after restart acceptance.
- [x] B1a. Remediate review finding: preserve old worker caches for active clients and target the accepted-update reload to only the requesting client; extend lifecycle coverage and record evidence. The worker-lifecycle simulation and client lifecycle contract passed on 2026-07-29.
- [x] B1b. Remediate review finding: scope offline navigation fallback to the active release cache, advance the worker registration/cache version together, and record deterministic worker-runtime evidence in `TDD_EVIDENCE.md`.
- [x] B2. Implement schema-validated user-initiated save export/import; tests cover corrupt, future, and valid save files; record evidence. `tests/save-recovery.test.js` passed 2/2 on 2026-07-29.
- [x] B3. Add progressive install control and iOS/desktop instructions; test that unsupported browsers remain fully playable. The Chrome-native prompt control and Safari Add to Dock guidance were manually observed; the unsupported-browser browser contract passed.

## Wave C — optional content and real devices

- [x] C1. Add optional era-pack download/eviction state machine with storage estimate, disclosure, and failure-safe fallback; defer actual downloads until era assets exist. `js/era-packs.js` provides consent, estimate, insufficient-storage, completion, failure, retry, and eviction states; the UI truthfully reports that no authored era pack is yet available.
- [ ] C2. Record manual installed/offline/update/resume scenarios on current iOS Safari, Android Chrome, Android Samsung Internet, desktop Chrome, Edge, Safari, and Firefox.
- [x] C3. Update README, deployment notes, manual QA, and `openspec/IMPLEMENTATION_ORDER.md`; run gates and complete validation. The initial full-regression checkpoint on 2026-07-29 passed `npm run check`; `npm test` 34/34; `npm run test:browser` 44/44; `npm run test:a11y` 3/3; strict OpenSpec validation; and `git diff --check`. The final evidence record contains subsequent 35/35 and 36/36 unit-test checkpoints. C2 remains the explicit installed-device release-certification follow-up.
