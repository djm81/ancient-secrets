# Tasks: adaptive-guidance

Ordering follows the repository discipline: spec → tests → failing evidence → implementation → passing evidence → quality gates → docs. Each task targets roughly two hours; each wave leaves the site shippable.

## Wave 0 — proposal stage (the only work performed now)

- [ ] 0a. Confirm specs in this change are accepted; coordinate the save-version bump with whichever sibling change lands first; record adjustments before coding.
- [ ] 0b. `openspec validate adaptive-guidance --strict` passes; `specfact requirements validate --bundle .specfact/projects/ancient-secrets` run noted.

## Wave A — model and persistence

- [ ] A1. Write failing unit tests for `suggestTier` purity, threshold behavior, and reveal-only-after-hint (AG-001); implement; record evidence.
- [ ] A2. Write failing tests for the `struggle` save block: migration from older saves, malformed-block reset, `isValidState` shape checks; implement; record evidence.
- [ ] A3. Write failing tests proving signals never enter `summarizeForGuidance` (AG-002); implement exclusion; record evidence.

## Wave B — suggestion surface

- [ ] B1. Build the dismissible suggestion surface with per-objective dismissal memory (AG-003); browser tests for dismissal and no-auto-reveal.
- [ ] B2. Implement opt-out: stop accumulation, clear signals, settings control (AG-005); unit + manual evidence.
- [ ] B3. Accessibility pass: announcement, keyboard dismissal, Escape, reduced motion, high contrast; manual + `npm run test:a11y` evidence.

## Wave C — gates and docs

- [ ] C1. AI-free full flow evidence (AG-004); network inspection evidence for AG-002; run all gates.
- [ ] C2. README manual-QA checklist update; validation matrix complete for AG- rows.
