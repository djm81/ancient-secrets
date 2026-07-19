# Change: Optional free-form debrief answers graded by a bounded LLM judge

## Why

The temporal-finops-expedition's debrief (MD-001..MD-004) is fixed multiple-choice: pedagogically safe, but it tests recognition, not understanding. Letting a player *explain* an era's discipline in their own words — "what did the farmed tax contract trade away?" — and receive rubric-graded feedback is a substantially stronger learning instrument and the clearest demonstration this project can offer of an LLM-as-judge built inside strict guardrails: the judge outputs only rubric booleans, feedback comes only from the authored bank, and no judge outcome can ever gate progression or lower a score below the multiple-choice equivalent.

## What Changes

- Add an optional **"answer in your own words"** path beside every debrief question. The multiple-choice path remains always available, mastery-equivalent, and the default.
- Add an explicit **opt-in consent flow**: before any answer leaves the device, the player is told exactly what is sent, where, and that it is never stored; withdrawal at any point reverts to multiple-choice.
- Add a **judge Worker route** mirroring the `workers/maestro-guide.js` discipline end to end: key allowlists, payload cap, origin pinning, rate-limit binding, fail-closed configuration, strict JSON-schema response format, and server-side re-validation of the model's reply.
- Constrain **judge output to rubric-criterion booleans** for the question's authored criteria. Feedback text is selected exclusively from the authored feedback bank keyed by criterion outcomes; the model authors no visible prose.
- Compute **mastery deltas client-side** as a pure function of the booleans, floored at the multiple-choice equivalent, preserving MD-004 determinism.

## Capabilities

- **free-response-debrief** — the free-form answer path, consent flow, and progression/mastery equivalence guarantees.
- **debrief-judge** — the Worker route, rubric-boolean output contract, authored feedback selection, and adversarial containment.

## Impact

- Affected runtime: expedition debrief UI (from temporal-finops-expedition), a new judge route beside `workers/maestro-guide.js` (or a sibling worker), a new debrief client module under `js/`, client-side scoring functions.
- Depends on `ai-guardrail-evals` (contract, harness registration) and on `temporal-finops-expedition` (MD-/FM- capabilities) being accepted; question and rubric banks live with the era content.
- `openspec/project.md` third non-negotiable is **amended**. Proposed exact wording, applied only when this change is accepted for implementation: *bullet three changes from "No provider secret, player-entered free text, account, or personal data belongs in the browser payload." to "No provider secret, account, or personal data belongs in the browser payload. Player-entered free text never ships in the payload and never leaves the device, with one exception: the explicitly opt-in expedition debrief answer, which is sent only to the project's own Worker, length- and schema-capped, never stored or logged server-side, never used for progression gating, and always replaceable by the multiple-choice path."* The other non-negotiables are unchanged and binding.
- README gains the debrief-judge description, its consent model, and deployment notes for the judge route.

## Constraints

- The judge is unavailable-by-default: no endpoint configured means the free-form option never renders (GR-004).
- Any judge failure — network, provider, schema violation, rate limit — silently falls back to the multiple-choice path for that question; the player is never blocked (GR-003).
- The Worker validates era and question identifiers against the authored bank server-side and never logs or stores answer text; the answer is bounded by a strict length cap.
- Judge output that is not exactly the expected boolean schema is discarded server-side; the client re-validates independently (GR-002).
- Free-form scoring can only match or exceed the multiple-choice minimum for the same understanding; it can never demote mastery (parity with FM-002's retry-never-demotes posture).

## Rollback

Remove the free-form option and the judge route; the multiple-choice debrief (MD-002) is the intact base path and mastery scoring (MD-004) is unaffected. The project.md amendment is reverted if the change is withdrawn.

## Out of scope

- Judge-authored feedback prose; storing or aggregating answers; grading anything outside the expedition debrief; certification claims; judge use for base-game puzzles.
