# Planned implementation order

Status: active roadmap. `responsive-investigative-surface` has its executable viewport matrix and iPhone Safari touch/VoiceOver focus evidence; native desktop Edge/Safari full loops and VoiceOver announcement evidence remain required. `installable-offline-web-app` now has its implementation, automated evidence, and native Chrome/Safari desktop smoke evidence; installed-device offline, update, and recovery certification remains required. This note orders accepted work; it does not relax a change's own validation gates.

## 1. Playability foundations

1. `responsive-investigative-surface` — establishes the phone, tablet, desktop, orientation, keyboard, and touch contract before adding content. The iPhone Safari touch, safe-area, and VoiceOver focus evidence is recorded; native desktop Edge/Safari full loops and VoiceOver announcement evidence remain outstanding.
2. `installable-offline-web-app` — implemented: the installable, offline app shell caches only approved same-origin core assets and never AI requests or model assets. Complete the recorded installed-device, update, and recovery matrix before release certification.

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
