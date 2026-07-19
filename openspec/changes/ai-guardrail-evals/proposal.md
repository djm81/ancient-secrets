# Change: Guardrail contract and adversarial evaluation harness for the AI surface

## Why

The project's AI surface is about to grow: local on-device inference, bounded NPC conversation, and an expedition debrief judge are proposed as sibling changes. Today's guardrails — `validateGuidance` in `js/game-core.js`, the strict request validation and fail-closed configuration in `workers/maestro-guide.js` — are implemented and unit-tested, but they exist only as code. They are not stated as a reusable contract that new AI features must satisfy, and they are not adversarially regression-tested: no test feeds the boundary a prompt-injection payload, no check rejects a model reply that invents game facts, and a model swap (for example changing `OPENAI_MODEL`) is gated by nothing.

This change codifies the guardrail contract as requirements that every current and future AI capability cites, and builds the evaluation harness that proves the contract holds under attack — before any new AI feature lands.

## What Changes

- Codify the six-point **guardrail contract** (model output never mutates state; deterministic validator between model and game; authored fallback always; fail-closed configuration; allowlisted input schema; adversarial scenarios required per AI capability) as requirements that sibling AI changes reference by ID.
- Add a **deterministic adversarial replay harness** to default CI: a committed corpus of hostile payloads (prompt injection embedded in every model-visible field, oversized and malformed inputs, spoofed model replies) driven through `validateGuidance` and `worker.fetch(Request)` with Node's built-in test runner, following the existing `tests/worker.test.js` pattern. No network, no secrets, no live model.
- Add **hallucination and spoiler checks**: validators that reject model replies referencing nonexistent scenes, items, or actions, and tier-appropriateness checks ensuring a nudge never contains solution tokens.
- Add an **optional live-model evaluation workflow**: manually dispatched, secrets only in CI environment, producing committed transcript artifacts; passing this evaluation gates model swaps. It is advisory to the static-site deploy and can never block it.

## Capabilities

- **guardrail-contract** — the six reusable guardrail requirements every AI capability must satisfy.
- **adversarial-eval-harness** — the offline red-team corpus and deterministic replay tests in default CI.
- **live-model-evals** — the optional, manually dispatched live-model evaluation workflow and model-swap gate.

## Impact

- New test files under `tests/` and a committed corpus directory `tests/fixtures/adversarial/`; one optional GitHub Actions workflow file for live evaluations.
- No player-visible behavior change: the client reply path gains one additional rejection check — a hallucination/spoiler validator added as a pure function alongside `validateGuidance` (exported for tests) — and rejected replies fall back to authored hints exactly as today; `workers/` and the shipped payload are otherwise untouched.
- No `openspec/project.md` non-negotiable is touched. This change strengthens all four: it adds proof that the static game, the AI-optional posture, the payload privacy boundary, and the compact experience survive hostile input.
- README gains a short "AI guardrails and evaluations" subsection linking the corpus and the workflow.

## Constraints

- Default CI never calls a live model and never requires a secret; the replay harness must pass offline.
- Live evaluations run only on manual dispatch with secrets held in CI environment configuration, never in repository files.
- The corpus is versioned in-repo; every corpus entry states which requirement it exercises.
- Evaluation transcripts committed as evidence must contain no secrets and no personal data.

## Rollback

The harness is additive test infrastructure. Deleting the workflow file, the fixtures directory, and the new test files restores the status quo; no runtime path depends on them.

## Out of scope

- Any new player-facing AI feature (covered by sibling changes).
- Automated live evaluation on every push or pull request.
- Third-party evaluation platforms or telemetry.
