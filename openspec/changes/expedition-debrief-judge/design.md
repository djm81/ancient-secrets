# Design: Bounded LLM judge for expedition debriefs

## 1. Rubric model

Each debrief question gains an authored rubric: two to four named criteria, each a plain statement of one idea a correct explanation demonstrates (for example, Rome: "names the commitment-versus-flexibility trade", "identifies who bears collection risk"). The judge is a per-criterion boolean classifier — "does this answer demonstrate this criterion?" — nothing more. Every criterion-outcome combination maps to authored feedback lines in the era's feedback bank, so all visible text is authored (MD-002 parity).

## 2. Worker route

`POST /api/debrief-judge`, mirroring `maestro-guide.js` discipline:

- Request body: `{era, questionId, answer}` — era and questionId validated against the authored bank server-side; answer a single string under a strict length cap; any extra key rejects the request; total payload capped as the guide route is today.
- Origin pinning, rate-limit binding, and fail-closed behavior identical to the guide Worker: an AI key without origin or rate-limit configuration returns 503.
- Model call uses a strict JSON-schema response format enumerating exactly the question's criterion IDs with boolean values; the Worker re-validates the parsed reply (unknown criteria, missing criteria, or non-boolean values discard the reply).
- On any failure the route returns a typed `unavailable` response; it never fabricates verdicts. The Worker neither logs nor stores the answer.

## 3. Score floor invariant

The client computes mastery deltas as a pure function of `(question, criterionBooleans)` using authored per-criterion deltas — the same determinism contract as MD-004. Two invariants: (a) the free-form delta is floored at the delta an equivalent multiple-choice outcome would earn, so choosing free-form can never be worse; (b) deltas come only from the authored table — the judge cannot produce a score, only booleans that index it.

## 4. Trust boundaries and injection analysis

The hostile field is the player's answer itself — free text flowing to a model by design. Containment (GR mapping):

- GR-001: the judge's booleans touch only the mastery ledger through the authored delta table; no game/progression state channel exists.
- GR-002: schema validation server-side plus independent client re-validation of criterion IDs and boolean types.
- GR-005: the model sees the authored question, the authored rubric, and the capped answer — never saves, identity, or other state.
- Injection outcomes are enumerable: an answer that manipulates the judge into all-true booleans earns at most the authored maximum delta for that question (equivalent to answering the multiple-choice correctly — the attacker gains a quiz point in their own private ledger); prompt-leak attempts can surface nothing but the authored rubric text at worst, and the schema leaves no channel for leaked prose to reach the player. Adversarial corpus entries (DJ-004) are registered with the evaluation harness per AE-005.

## 5. Consent UX and disclosure

The free-form option renders disabled until the player opens a consent disclosure stating: exactly what is sent (`era`, `questionId`, the answer text), the destination (the project's own Worker), retention (none), and the alternative (multiple-choice, always). Consent is per-session, revocable from the same surface, and never pre-checked. Declining or revoking hides the free-form path with no penalty.

## 6. Fallbacks

No endpoint configured → option never renders. Endpoint fails, times out, rate-limits, or returns `unavailable` → the question silently presents multiple-choice, with the state machine guaranteeing every question reaches an answered state through MD-002 regardless of judge behavior.

## 7. Rollback

Remove the route, module, and option; revert the project.md amendment. Era content keeps its rubric tables inertly; MD-/FM- behavior is untouched.
