# Planned implementation order

Status: active roadmap. `responsive-investigative-surface` is complete for the 2026-07-27 delivery: its executable viewport matrix and iPhone Safari touch/VoiceOver evidence passed. Android Chrome physical validation and the full Firefox run are documented user-approved skips in its validation matrix. This note orders accepted work; it does not relax a change's own validation gates.

## 1. Playability foundations

1. `responsive-investigative-surface` — complete with documented Android Chrome and Firefox skips: establishes the phone, tablet, desktop, orientation, keyboard, and touch contract before adding content. The iPhone Safari touch, safe-area, and VoiceOver evidence is recorded.
2. `installable-offline-web-app` — add the installable, offline app shell after the responsive surface is stable. It must never cache AI requests or model assets.

## 2. Story and game vertical slice

3. `temporal-finops-expedition`, Wave A only — ship Babylon as the first-act vertical slice using the responsive and offline foundations. Validate its investigation loop and story pacing on real iOS Safari and Android Chrome before scaling content.
4. `temporal-finops-expedition`, Waves B–D — add the remaining acts only after the Babylon evidence passes.

## 3. Optional AI and authoring enhancements

5. `ai-case-study-docs` — baseline threat model and accepted-risk register before any AI-surface implementation.
6. `ai-guardrail-evals` — reusable contract and offline adversarial harness.
7. `on-device-guidance` — browser-native Prompt API only; it must preserve the app-shell cache boundary.
8. `adaptive-guidance`, `verified-puzzle-pipeline`, then `local-npc-conversation` and `expedition-debrief-judge` only when their declared dependencies and threat-model updates are complete.

## Non-negotiable release gates

- Never add an era or AI surface to a layout that has not passed the responsive matrix.
- Never claim offline support until the installed app launches and completes a saved chronicle without a network connection.
- Never update a service worker during an active chronicle without an explicit restart/new-version handoff.
- Every delivery wave runs `npm run check`, `npm test`, `git diff --check`, its OpenSpec validation, and its recorded browser/device scenarios.
