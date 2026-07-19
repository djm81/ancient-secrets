# Tasks: expedition-debrief-judge

Ordering follows the repository discipline: spec → tests → failing evidence → implementation → passing evidence → quality gates → docs. Each task targets roughly two hours; each wave leaves the site shippable. Depends on `ai-guardrail-evals` and on `temporal-finops-expedition` (MD-/FM- capabilities) being accepted and its debrief implemented.

## Wave 0 — proposal stage (the only work performed now)

- [ ] 0a. Confirm specs in this change are accepted; confirm the project.md third-non-negotiable amendment wording with the maintainer; confirm MD-spec stability in temporal-finops-expedition; record adjustments before coding.
- [ ] 0b. `openspec validate expedition-debrief-judge --strict` passes; harvest specs with `specfact requirements import --from-openspec --bundle .specfact/projects/ancient-secrets openspec/changes/expedition-debrief-judge`, then `specfact requirements validate --bundle .specfact/projects/ancient-secrets`.

## Wave A — rubric and client scoring

- [ ] A1. Author rubric criteria and per-criterion delta tables for one era's three questions; extend the authored feedback bank by criterion outcome; schema unit tests.
- [ ] A2. Write failing unit tests for client scoring: pure function of booleans, MCQ-floor invariant, MD-004 reproducibility parity (DJ-003, FR-002); implement; record evidence.
- [ ] A3. Write failing unit tests for client-side verdict re-validation (unknown/missing/non-boolean criteria discarded) (DJ-002); implement; record evidence.

## Wave B — judge Worker route

- [ ] B1. Write failing `worker.fetch(Request)` tests for the judge route: allowlist rejection, unknown era/question rejection, length and payload caps, origin pinning, rate-limit behavior, fail-closed partial configuration (DJ-001); implement the route; record evidence.
- [ ] B2. Implement the strict JSON-schema model call and server-side verdict validation with typed `unavailable` fallback (DJ-002); tests with mocked provider responses including malformed verdicts; record evidence.
- [ ] B3. Build the DJ-004 adversarial corpus (injection answers) and register the surface with the evaluation harness (AE-005); offline replay green; record evidence.

## Wave C — client flow and consent

- [ ] C1. Implement the debrief client module: consent state machine (per-session, revocable, never pre-checked), free-form submission, timeout fallback to multiple-choice (FR-002, FR-003); unit tests; record evidence.
- [ ] C2. Build the free-form UI in the debrief panel with the disclosure surface; browser tests for no-consent-no-egress and revocation (FR-003); a11y pass with `npm run test:a11y`.
- [ ] C3. Manual evidence: full debrief with judge enabled, judge outage mid-debrief, MCQ-only mastery parity run (FR-001, FR-002).

## Wave D — remaining eras, live evaluation, amendment, docs

- [ ] D1. Author rubrics, deltas, and feedback for the remaining eras; data-completeness unit tests.
- [ ] D2. Run a live evaluation of the judge over the DJ-004 corpus per LM-002; commit transcripts as model-swap-gate baseline evidence.
- [ ] D3. Apply the `openspec/project.md` third-non-negotiable amendment exactly as worded in the proposal's Impact section.
- [ ] D4. Run all gates; README judge/consent/deployment subsection; validation matrix complete for FR-, DJ- rows.
- [ ] D5. Update `docs/ai-threat-model.md` for the judge surface if the baseline threat model exists (TM-003); record the review.
