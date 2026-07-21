# Tasks: installable-offline-web-app

## Wave 0 — proposal stage

- [ ] 0a. Confirm the GitHub Pages deployment path, supported browser/device matrix, and cache-size budget; run `openspec validate installable-offline-web-app --strict`.

## Wave A — app identity and offline shell

- [ ] A1. Create failing tests for manifest identity, relative scope/start route, icons, standalone display, and local font references; implement manifest/head/icon/font assets; record evidence.
- [ ] A2. Create failing service-worker tests for core precache list, GET-only handling, offline navigation, and explicit exclusion of POST/AI/model requests; implement; record evidence.
- [ ] A3. Add offline browser tests: successful first online launch followed by offline launch, resume, and authored guidance; record evidence.

## Wave B — lifecycle and recovery

- [ ] B1. Create failing tests for waiting updates and no reload during an active chronicle; implement restart handoff; record evidence.
- [ ] B2. Implement schema-validated user-initiated save export/import; tests cover corrupt, future, and valid save files; record evidence.
- [ ] B3. Add progressive install control and iOS/desktop instructions; test that unsupported browsers remain fully playable.

## Wave C — optional content and real devices

- [ ] C1. Add optional era-pack download/eviction state machine with storage estimate, disclosure, and failure-safe fallback; defer until era assets exist.
- [ ] C2. Record manual installed/offline/update/resume scenarios on current iOS Safari, Android Chrome, Android Samsung Internet, desktop Chrome, Edge, Safari, and Firefox.
- [ ] C3. Update README, deployment notes, manual QA, and `openspec/IMPLEMENTATION_ORDER.md`; run gates and complete validation.
