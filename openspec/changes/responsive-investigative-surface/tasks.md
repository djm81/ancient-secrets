# Tasks: responsive-investigative-surface

## Wave 0 — proposal stage

- [ ] 0a. Confirm the viewport matrix and browser/device baseline; run `openspec validate responsive-investigative-surface --strict`.

## Wave A — pure action and layout contracts

- [x] A1. Write failing unit tests for `deriveContextualActions`: relevance cap, complete-list fallback, and parity with desktop interaction IDs; record evidence.
- [x] A2. Implement the pure action derivation and Casebook data contract; record passing evidence.
- [x] A3. Write failing browser tests for state/focus preservation across viewport changes and rotation; implement responsive mode switching; record evidence.

## Wave B — surfaces and accessibility

- [x] B1. Build portrait tray, landscape rail, desktop rail, and portrait dock with safe-area spacing and 44px targets.
- [ ] B2. Run keyboard, screen-reader announcement, reduced-motion, high-contrast, and touch parity checks at every viewport; record evidence.

## Wave C — device proof and docs

- [ ] C1. Execute the full-loop matrix on current iOS Safari, Android Chrome, and desktop Chrome/Edge/Safari/Firefox; record device, browser version, viewport, and observed result.
- [ ] C2. Update README manual QA and `openspec/IMPLEMENTATION_ORDER.md`; run required gates and complete validation.
