# Tasks: responsive-investigative-surface

## Wave 0 — proposal stage

- [x] 0a. Confirm the viewport matrix and browser/device baseline; run `openspec validate responsive-investigative-surface --strict`.

## Wave A — pure action and layout contracts

- [x] A1. Write failing unit tests for `deriveContextualActions`: relevance cap, complete-list fallback, and parity with desktop interaction IDs; record evidence.
- [x] A2. Implement the pure action derivation and Casebook data contract; record passing evidence.
- [x] A3. Write failing browser tests for state/focus preservation across viewport changes and rotation; implement responsive mode switching; record evidence.

## Wave B — surfaces and accessibility

- [x] B1. Build portrait tray, landscape rail, desktop rail, and portrait dock with safe-area spacing and 44px targets.
- [ ] B2. Run keyboard, screen-reader announcement, reduced-motion, high-contrast, and touch parity checks at every viewport; record evidence. Automated keyboard, motion, contrast, and touch checks plus iPhone Safari touch and VoiceOver focus evidence are recorded; native VoiceOver announcement evidence remains outstanding. Android Chrome physical evidence is a user-approved skip.

## Wave C — device proof and docs

- [ ] C1. Execute the full-loop matrix on current iOS Safari, Android Chrome, and desktop Chrome/Edge/Safari/Firefox; record device, browser version, viewport, and observed result. The iPhone Safari full loop and VoiceOver focus checks passed; Android Chrome physical validation and the full Firefox run are user-approved skips. Native desktop Edge and Safari full-loop evidence remains outstanding.
- [ ] C2. Update README manual QA and `openspec/IMPLEMENTATION_ORDER.md`; run required gates and complete validation. The documentation and gates are current; final completion awaits the outstanding B2 and C1 evidence.
