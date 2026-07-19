# Tasks: ai-case-study-docs

Ordering follows the repository discipline. Evidence for this change is largely documented manual review (a justified exception per the TDD evidence template); the traceability sweep is the automated element.

## Wave 0 — proposal stage (the only work performed now)

- [ ] 0a. Confirm specs in this change are accepted; record any scope adjustments before writing.
- [ ] 0b. `openspec validate ai-case-study-docs --strict` passes; `specfact requirements validate --bundle .specfact/projects/ancient-secrets` run noted.

## Wave A — threat model

- [ ] A1. Draft `docs/ai-threat-model.md`: surface inventory, per-surface STRIDE-lite analysis, cross-cutting mitigations, accepted risks (TM-001, TM-002).
- [ ] A2. Traceability sweep: every threat maps to a requirement ID or accepted-risk entry; record the review as evidence (TM-002).
- [ ] A3. Wire the TM-003 governance rule into the review checklist referenced by GR-006/AE-005.

## Wave B — case study

- [ ] B1. Draft `docs/ai-case-study.md` sections 1–3 (optionality, authoring-time AI, runtime guardrail architecture) with requirement-ID citations (CS-001, CS-002).
- [ ] B2. Draft sections 4–6 (agentic workflow, evaluation story, implemented-vs-proposed status table) (CS-001, CS-002).
- [ ] B3. Claim-by-claim traceability review; record defects found and fixed (CS-002).

## Wave C — links and gates

- [ ] C1. README links to both documents; confirm GitHub rendering (CS-001, CS-003).
- [ ] C2. Run `npm run check`, `npm test`, `git diff --check`; validation matrix complete for CS-, TM- rows.
