# Tasks: on-device-guidance

Ordering follows the repository discipline: spec → tests → failing evidence → implementation → passing evidence → quality gates → docs. Each task targets roughly two hours; each wave leaves the site shippable. Follow `openspec/IMPLEMENTATION_ORDER.md`: depends on `responsive-investigative-surface`, `installable-offline-web-app`, `temporal-finops-expedition` (migration registry), `ai-case-study-docs` (baseline threat model), and `ai-guardrail-evals` (guardrail contract, harness registration).

## Wave 0 — proposal stage (the only work performed now)

- [ ] 0a. Confirm specs in this change are accepted; confirm responsive/offline evidence and the baseline threat model are complete; agree the registry step with `temporal-finops-expedition` and `adaptive-guidance` before coding.
- [ ] 0b. `openspec validate on-device-guidance --strict` passes; harvest specs with `specfact requirements import --from-openspec --bundle .specfact/projects/ancient-secrets openspec/changes/on-device-guidance`, then `specfact requirements validate --bundle .specfact/projects/ancient-secrets`.

## Wave A — backend abstraction

- [ ] A1. Write failing unit tests for backend resolution in `guidance-client.js`: authored default, unknown persisted backend degrades to authored, worker path unchanged (GB-001, GB-003); record failing evidence.
- [ ] A2. Implement the backend abstraction; record passing evidence.
- [ ] A3. Write failing tests for preference persistence through the ordered migration registry, safe degradation on resume, preservation of expedition and sibling struggle state, and complete-state resume restoration (GB-003, GB-004); implement; record evidence.

## Wave B — browser-native local backend (Prompt API)

- [ ] B1. Write failing tests for `local-inference.js` with injected Prompt API fakes: unavailable, partially available, and crashing runtimes all resolve to authored; detection performs no dynamic import or application-initiated request (LI-001); implement detection; record evidence.
- [ ] B2. Implement Prompt API generation with the shared summary prompt and reply contract; route replies through `validateGuidance` + canonical-identifier/spoiler validators; unit tests with spoofed replies (LI-003); record evidence.
- [ ] B3. Implement timeout race and late-reply suppression with failing-then-passing tests (LI-004).
- [ ] B4. Register the local backend surface and spoofed-local-reply corpus entries with the adversarial harness (LI-005, AE-005); replay green.

## Wave C — opt-in UX and accessibility

- [ ] C1. Build the opt-in disclosure, initialization cancellation, and preference-revert flow in the settings surface; unit-test the state machine; manual evidence that the application makes no asset request before or after consent (LI-002).
- [ ] C2. Accessibility pass: keyboard operability, announcements, reduced motion, high contrast on all new controls; manual + `npm run test:a11y` evidence.

## Wave D — gates and docs

- [ ] D1. Network-silence evidence: recorded browser session showing no application-initiated guidance or asset request with the local backend active; record browser-managed activity separately rather than attributing it to the application (GB-002); confirm initial page payload unchanged.
- [ ] D2. Run all gates; README subsection on the three backends and browser-native activation disclosure; validation matrix complete for LI-, GB- rows.
- [ ] D3. Update `docs/ai-threat-model.md` for the local-inference surface if the baseline threat model exists (TM-003); record the review.
