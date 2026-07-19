# Tasks: on-device-guidance

Ordering follows the repository discipline: spec → tests → failing evidence → implementation → passing evidence → quality gates → docs. Each task targets roughly two hours; each wave leaves the site shippable. Depends on `ai-guardrail-evals` (guardrail contract, harness registration).

## Wave 0 — proposal stage (the only work performed now)

- [ ] 0a. Confirm specs in this change are accepted; record any scope adjustments back into proposal/design before coding.
- [ ] 0b. `openspec validate on-device-guidance --strict` passes; harvest specs with `specfact requirements import --from-openspec --bundle .specfact/projects/ancient-secrets openspec/changes/on-device-guidance`, then `specfact requirements validate --bundle .specfact/projects/ancient-secrets`.

## Wave A — backend abstraction

- [ ] A1. Write failing unit tests for backend resolution in `guidance-client.js`: authored default, unknown persisted backend degrades to authored, worker path unchanged (GB-001, GB-003); record failing evidence.
- [ ] A2. Implement the backend abstraction; record passing evidence.
- [ ] A3. Write failing tests for preference persistence in the next save schema version and safe degradation on resume (GB-003); implement; record evidence.

## Wave B — first local backend (Prompt API)

- [ ] B1. Write failing tests for `local-inference.js` detection ladder with injected fakes: unavailable, partially available, and crashing engines all resolve to authored (LI-001); implement detection; record evidence.
- [ ] B2. Implement Prompt API generation with the shared summary prompt and reply contract; route replies through `validateGuidance` + hallucination/spoiler validators; unit tests with spoofed replies (LI-003); record evidence.
- [ ] B3. Implement timeout race and late-reply suppression with failing-then-passing tests (LI-004).
- [ ] B4. Register the local backend surface and spoofed-local-reply corpus entries with the adversarial harness (LI-005, AE-005); replay green.

## Wave C — downloadable engines and opt-in UX

- [ ] C1. Implement WebLLM backend behind the same interface; detection and validation tests reuse Wave B fakes (LI-001, LI-003).
- [ ] C2. Implement transformers.js WASM fallback behind the same interface.
- [ ] C3. Build the opt-in disclosure, download progress, cancellation, and eviction flow in the settings surface; unit-test the state machine; manual evidence for consent-before-download and eviction (LI-002).
- [ ] C4. Accessibility pass: keyboard operability, announcements, reduced motion, high contrast on all new controls; manual + `npm run test:a11y` evidence.

## Wave D — gates and docs

- [ ] D1. Network-silence evidence: recorded browser session showing zero guidance traffic with the local backend active (GB-002); confirm initial page payload unchanged.
- [ ] D2. Run all gates; README subsection on the three backends and opt-in download; validation matrix complete for LI-, GB- rows.
- [ ] D3. Update `docs/ai-threat-model.md` for the local-inference surface if the baseline threat model exists (TM-003); record the review.
