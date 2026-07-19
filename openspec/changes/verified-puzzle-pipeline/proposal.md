# Change: Generative-with-verifier puzzle variant pipeline (authoring-time)

## Why

Replay variety currently comes from seeded randomization over a fixed set of authored elements (gear route, clue location, code, bell order). Broadening variety by hand-authoring more variants is slow; letting a model generate variants at runtime would violate the project's integrity guarantees. The middle path is the classic generate-then-verify pattern: a language model **proposes** variant content at authoring time, a deterministic solver **proves** each candidate solvable and fair, a human curates the survivors, and only verified, frozen data ships. The shipped game stays 100% static and authored; the AI contribution is fully auditable through committed verification logs.

## What Changes

- Add an **authoring-time pipeline** (repo-local scripts, excluded from the site payload): model proposes candidate variants — clue wording sets, note phrasings, Roman-numeral clue presentations, code-placement flavor — against a strict candidate schema.
- Add a **deterministic solver/verifier** reusing `js/game-core.js` pure functions and `isValidRun`-style constraints: every candidate is checked for solvability, constraint conformance, solution uniqueness, and vocabulary bounds (no references outside authored scenes/items/actions).
- Add a **curation record**: every shipped variant carries reviewer sign-off; every rejected candidate is logged with its rejection reason. The verification log is committed as evidence.
- Ship survivors as a **frozen static data module** under `js/`; runtime selection is seed-deterministic and stable across save/resume, extending the existing `createRun` pattern.

## Capabilities

- **puzzle-variant-pipeline** — candidate schema, solver verification, curation records, frozen shipped data, and deterministic runtime selection.

## Impact

- New authoring scripts (for example under `tools/variants/`), a new static variant data module under `js/`, unit tests validating all shipped data, and the committed verification log.
- **No `openspec/project.md` non-negotiable is touched**: zero runtime AI; shipped content is verifier-approved, human-curated authored data; the variant count is budgeted in the design so the compact experience and payload posture hold; static-first is unchanged.
- README gains a short description of the generate-then-verify workflow beside the existing AI-assisted art workflow section.

## Constraints

- The pipeline never runs in default CI and requires no secrets there; model access happens only in the authoring environment.
- Shipped variant data is frozen and schema-validated by unit tests; no variant may reference scenes, items, actions, or vocabulary outside the authored sets.
- Runtime selection is a pure function of the run seed; resuming a save never changes the selected variant.
- The verification log (accepted + rejected with reasons) is committed alongside any variant batch.

## Rollback

Delete the variant data module and pipeline scripts; the original authored puzzle content and `createRun` behavior are unchanged and remain the fallback when zero variants ship.

## Out of scope

- Runtime generation of any content; variants for dialogue, narrative, or endings; difficulty scaling; expanding the puzzle graph itself.
