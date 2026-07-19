# Tasks: ai-guardrail-evals

Ordering follows the repository discipline: spec → tests → failing evidence → implementation → passing evidence → quality gates → docs. Each task targets roughly two hours; each wave leaves the site shippable.

## Wave 0 — proposal stage (the only work performed now)

- [ ] 0a. Confirm specs in this change are accepted; record any scope adjustments back into proposal/design before coding.
- [ ] 0b. `openspec validate ai-guardrail-evals --strict` passes; run `specfact requirements validate --bundle .specfact/projects/ancient-secrets` (if spec harvest into the bundle requires a separate CLI step, record the exact command here before Wave A).

## Wave A — contract codification and replay skeleton

- [ ] A1. Write failing replay tests driving the existing `validateGuidance` and `worker.fetch(Request)` from a first minimal corpus (injection-in-field family); record failing evidence for the not-yet-existing corpus loader (AE-001, AE-002).
- [ ] A2. Implement the corpus loader and `tests/fixtures/adversarial/` structure with per-entry requirement tags; record passing evidence.
- [ ] A3. Add contract conformance tests asserting GR-001..GR-005 against the current guidance path (state immutability, tamper rejection, fallback completeness, fail-closed worker, allowlist rejection); record evidence.

## Wave B — hallucination and spoiler validation

- [ ] B1. Write failing unit tests for the hallucination validator (nonexistent scenes/items/actions rejected, ordinary prose accepted) (AE-003).
- [ ] B2. Implement the validator as a pure exported function beside `validateGuidance`; wire it into the client reply path; record passing evidence.
- [ ] B3. Write failing tests for per-tier spoiler checks against seeded runs (code digits, bell order, gear route) (AE-004); implement; record passing evidence.
- [ ] B4. Extend the corpus with encoding variants, spoofed replies, and malformed-structure families; replay green (AE-001).

## Wave C — surface registration and live evaluations

- [ ] C1. Implement harness surface registration with the empty-corpus failure rule; failing then passing evidence (AE-005).
- [ ] C2. Author the manually dispatched live-evaluation workflow (secrets from CI environment only, transcript artifact format per design §6); dry-run without secrets records the skip path (LM-001, LM-003).
- [ ] C3. Run one live evaluation against the deployed worker; review and commit transcripts as evidence; document the model-swap gate procedure (LM-002).

## Wave D — gates and docs

- [ ] D1. Run `npm run check`, `npm test`, `git diff --check`; confirm `npm test` needs no network; record in validation.md.
- [ ] D2. README subsection "AI guardrails and evaluations" linking the corpus, the workflow, and the swap gate; validation matrix complete for GR-, AE-, LM- rows.
