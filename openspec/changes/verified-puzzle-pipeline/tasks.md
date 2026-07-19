# Tasks: verified-puzzle-pipeline

Ordering follows the repository discipline: spec → tests → failing evidence → implementation → passing evidence → quality gates → docs. Each task targets roughly two hours; each wave leaves the site shippable.

## Wave 0 — proposal stage (the only work performed now)

- [ ] 0a. Confirm specs in this change are accepted; record any scope adjustments before coding.
- [ ] 0b. `openspec validate verified-puzzle-pipeline --strict` passes; harvest specs with `specfact requirements import --from-openspec --bundle .specfact/projects/ancient-secrets openspec/changes/verified-puzzle-pipeline`, then `specfact requirements validate --bundle .specfact/projects/ancient-secrets`.

## Wave A — schema and verifier

- [ ] A1. Define the candidate schema and write failing unit tests for schema validation and vocabulary bounds (VP-004); implement the validator; record evidence.
- [ ] A2. Write failing tests for the solver: completion replay across the seed range, constraint conformance, solution uniqueness, machine-readable rejection reasons (VP-002); implement the verifier script importing `game-core.js`; record evidence.

## Wave B — pipeline and first batch

- [ ] B1. Implement the proposal script and verdict-log format; run a first model batch in the authoring environment; commit candidates, verdicts, and curation records (VP-003).
- [ ] B2. Freeze the first accepted variants into the static data module; extend `createRun`/`isValidRun` for the variant index with failing-then-passing tests (VP-005).
- [ ] B3. Add the default-CI data-validation suite over shipped variants (VP-004); reproduce a verdict log from committed candidates as audit evidence (VP-003).

## Wave C — runtime and gates

- [ ] C1. Wire variant text into scene/clue rendering; save/resume stability tests (VP-005); offline playthrough evidence (VP-001).
- [ ] C2. Run all gates; README generate-then-verify subsection; validation matrix complete for VP- rows.
- [ ] C3. Update `docs/ai-threat-model.md` for the authoring-pipeline surface if the baseline threat model exists (TM-003); record the review.
