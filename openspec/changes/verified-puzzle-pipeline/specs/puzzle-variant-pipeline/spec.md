# Puzzle variant pipeline specification

## ADDED Requirements

### Requirement: VP-001 The shipped payload contains only static verified data with zero runtime model calls

Variant content in the deployed site SHALL be frozen static data; the game SHALL make no model call, of any kind, for puzzle content at runtime, and SHALL be fully playable offline with variants active.

#### Scenario: Offline play with variants

- **GIVEN** a deployed build containing verified variants and a browser with network access disabled after load
- **WHEN** a full chronicle is played
- **THEN** every puzzle functions and no content request or model call is attempted

### Requirement: VP-002 Every shipped variant passes the deterministic solver

No variant SHALL ship unless the solver has verified, across the tested seed range, that the game remains completable with the variant applied, run constraints hold, and the strongbox solution remains unique. This requirement covers structural properties only; prose clarity and fairness are reviewed under VP-006.

#### Scenario: Unsolvable candidate is rejected

- **GIVEN** a candidate whose clue wording contradicts the code it must reveal
- **WHEN** the verifier runs
- **THEN** the candidate is rejected with a machine-readable reason and cannot enter the shipped data module

### Requirement: VP-003 The verification log is committed as evidence

Every variant batch SHALL commit its proposal file, per-candidate verdicts including rejection reasons, and curation records, such that verdicts are reproducible by re-running the verifier against the committed candidates.

#### Scenario: Reproducible audit

- **GIVEN** a committed batch
- **WHEN** a reviewer re-runs the verifier on its candidates file
- **THEN** the produced verdicts match the committed log

### Requirement: VP-004 Shipped variant data is schema-validated and human-curated

Unit tests in default CI SHALL validate every shipped variant against the candidate schema and the authored vocabulary bounds, and every shipped variant SHALL carry a curation record naming its reviewer.

#### Scenario: Vocabulary violation fails CI

- **GIVEN** a shipped variant referencing a scene absent from `SCENE_GRAPH`
- **WHEN** `npm test` runs
- **THEN** the data-validation suite fails naming the variant

### Requirement: VP-005 Runtime variant selection is seed-deterministic and save-stable

Variant selection SHALL be a pure function of the chronicle's run data, fixed at creation, unchanged by save/resume, and absent variants SHALL reproduce today's behavior exactly.

#### Scenario: Resume preserves the variant

- **GIVEN** a chronicle created with a specific variant selected
- **WHEN** the game is saved, reloaded, and resumed
- **THEN** the same variant is active and all clue text matches the pre-save session

### Requirement: VP-006 Semantic clarity and fairness are explicitly human-curated

Every shipped prose variant SHALL carry a curation record naming a reviewer and recording a checklist review of factual consistency with its route/code, clue clarity, vocabulary appropriateness, and spoiler/tier appropriateness. The deterministic verifier SHALL NOT be represented as proof of these semantic judgments.

#### Scenario: Semantically unclear candidate cannot ship

- **GIVEN** a structurally valid candidate whose clue wording is ambiguous or contradicts its route/code
- **WHEN** the curation checklist is reviewed
- **THEN** it is rejected with the checklist reason and cannot enter the shipped data module
