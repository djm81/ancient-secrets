# Tasks: local-npc-conversation

Ordering follows the repository discipline: spec → tests → failing evidence → implementation → passing evidence → quality gates → docs. Each task targets roughly two hours; each wave leaves the site shippable. Depends on `ai-guardrail-evals` and `on-device-guidance` being implemented.

## Wave 0 — proposal stage (the only work performed now)

- [ ] 0a. Confirm specs in this change are accepted; confirm the scoped project.md chatbot-clause amendment wording with the maintainer; record adjustments before coding.
- [ ] 0b. `openspec validate local-npc-conversation --strict` passes; harvest specs with `specfact requirements import --from-openspec --bundle .specfact/projects/ancient-secrets openspec/changes/local-npc-conversation`, then `specfact requirements validate --bundle .specfact/projects/ancient-secrets`.

## Wave A — intent boundary in game-core

- [ ] A1. Define the frozen per-encounter intent enum and intent-effect table beside `DIALOGUE_VALUES`; write failing unit tests: enum-only channel, consumed-choice refusal, out-of-context no-ops (IB-001, IB-002); record failing evidence.
- [ ] A2. Implement the intent gate reusing `chooseDialogue` validation discipline; record passing evidence.
- [ ] A3. Build the recorded-classifier-output corpus (hostile, malformed, out-of-context) and replay tests in `npm test` (IB-003 scenarios, IB-004); register the surface with the adversarial harness (SF-003); record evidence.

## Wave B — persona layer and safety filter

- [ ] B1. Write failing unit tests for the lexical filter (both directions, deflection substitution, determinism) (SF-001); implement; record evidence.
- [ ] B2. Implement `js/npc-conversation.js`: classification call and persona call against the local backend interface, length caps, deflection fallbacks (NC-003); unit tests with fake engines; record evidence.
- [ ] B3. Write failing tests proving conversation content never reaches `summarizeForGuidance`, storage, or the save schema (NC-002, SF-002); implement lifetime handling (in-memory only, discard on close); record evidence.

## Wave C — dialogue surface

- [ ] C1. Add the free-text field to NPC dialogue panels gated on local-inference readiness; graceful mid-dialogue degradation (NC-004); browser tests for gating and parity (NC-001).
- [ ] C2. Accessibility pass: labelled input, keyboard flow, announced replies, reduced motion, high contrast; manual + `npm run test:a11y` evidence.
- [ ] C3. Manual red-team session against a live local model: record IB-003 scenario outcomes and byte-identical state checks in validation.md.

## Wave D — gates, amendment, docs

- [ ] D1. Run all gates; network + save inspection evidence for NC-002/SF-002 recorded.
- [ ] D2. Apply the scoped `openspec/project.md` chatbot-clause amendment exactly as worded in the proposal's Impact section.
- [ ] D3. README subsection on the hybrid persona/intent architecture; validation matrix complete for NC-, IB-, SF- rows.
- [ ] D4. Update `docs/ai-threat-model.md` for the conversation surface if the baseline threat model exists (TM-003); record the review.
