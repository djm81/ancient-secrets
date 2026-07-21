# Design: Verified puzzle variant pipeline

## 1. Pipeline stages and data contract

`propose → verify → curate → freeze`. The candidate schema fixes exactly which fields a model may propose (for example: note phrasing keyed by gear route, clue presentation keyed by clue location) and their length/vocabulary bounds. Each candidate flows to a verdict record `{candidateId, verdict, reasons[], contentHash}`; accepted candidates gain a curation record `{reviewer, date, notes}` before entering the frozen data module. The full verdict log is committed per batch.

## 2. Solver design

The verifier is a Node script importing `js/game-core.js` directly: it instantiates runs across the seed space with the candidate applied, replays the canonical solution path with the existing pure functions, and asserts completion, `isValidRun` conformance, uniqueness of the strongbox solution, and a vocabulary sweep (tokens restricted to authored scenes/items/actions plus a curated lexicon). Any assertion failure rejects the candidate with a machine-readable reason. These are structural checks; they do not claim to prove that arbitrary prose is clear, fair, or semantically non-contradictory.

## 3. Provenance and evidence

Every batch commit contains: candidates file (as proposed), verdict log, curation records, and the resulting data module — all sha-pinned by the commit itself. Curation records name the reviewer and record a checklist review of clue clarity, factual consistency with the route/code, vocabulary appropriateness, and spoiler/tier appropriateness. This makes the AI contribution auditable end-to-end: a reviewer can re-run the verifier against the committed candidates and reproduce the structural verdicts, then inspect the separate human judgment.

## 4. Runtime selection determinism and save stability

The variant index joins the run object created by `createRun` (validated by an extended `isValidRun`), so selection is fixed at chronicle creation and survives save/resume unchanged. Zero shipped variants means `createRun` behaves exactly as today.

## 5. Rollback

Remove the data module and scripts; runtime falls back to the original single authored variant per element. Saves holding a variant index degrade safely via run validation.
