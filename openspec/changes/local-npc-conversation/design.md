# Design: Bounded free-text NPC conversation

## 1. Hybrid architecture: persona layer and intent layer

Two separate model interactions with separate validators, so a failure of one cannot widen the other:

- **Intent classification**: player text → local model constrained to output one member of the closed intent enum (JSON schema / constrained decoding where the engine supports it; defensive parse plus allowlist check regardless). The classifier's output is *data*, not action: `js/game-core.js` re-validates the intent against current state using the same discipline as `chooseDialogue` (already-answered encounters, invalid values, and out-of-context intents throw or no-op).
- **Persona reply**: player text + authored character brief + allowlisted scene facts → short in-character reply, length-capped, filtered, displayed as flavor only.

The fixed-choice buttons stay rendered above the free-text field at all times; the intent path can trigger only effects the fixed choices already have.

## 2. Intent enum design

Closed set per encounter, derived from the authored dialogue: the existing value choices (`insight`, `compassion`, `ambition` where an encounter offers them), plus conversational no-ops (`greet`, `ask-about-maestro`, `ask-about-scene`, `farewell`) that map to authored flavor lines, plus `unknown`. The enum is frozen in `game-core.js` beside `DIALOGUE_VALUES`; adding a member is a spec-level change. Intent effects are table-driven — intent → existing authored handler — with no free parameters from the model.

## 3. Jailbreak containment analysis

- The model has **no state-mutation channel**: persona output is display text; intent output is an enum member validated twice (schema, then state re-validation).
- Prompt injection in player text can, at worst, steer the persona's wording or produce `unknown`. It cannot mint new intents (allowlist), replay consumed intents (state re-validation), or reach the save (lifetime rule).
- Injection via game data is bounded by GR-005: the persona prompt's scene context comes from authored constants, not player-controlled strings.
- Containment is proven, not assumed: adversarial corpus entries (direct jailbreak, role-play escalation, instruction smuggling) replay through the intent gate with recorded classifier outputs in CI (IB-004), and the harness registration satisfies AE-005/GR-006.

## 4. Safety filter

A lexical filter runs on player text before classification and on persona output before display: profanity/slur lexicon, out-of-world content classes, and length caps. Any hit replaces the reply with a per-character authored deflection ("Brother Matteo returns to his manuscript…"). The filter is deterministic, versioned in-repo, and unit-tested; it is a floor under the model, not a substitute for the intent boundary.

## 5. Privacy: text lifetime

Player text exists only in the dialogue panel's in-memory state: discarded on dialogue close, never written to `localStorage` or the save schema, never included in `summarizeForGuidance`, never in any network request (the local backend is network-silent per GB-002). No transcript survives the dialogue.

## 6. Trust boundaries (GR mapping)

GR-001 persona text display-only, intent enum validated; GR-002 schema check + state re-validation between model and game; GR-003 fixed-choice dialogue is the authored, complete path; GR-004 missing opt-in or backend failure removes the free-text surface entirely; GR-005 model sees player text (device-local only) plus authored briefs and allowlisted scene facts — never saves or identity; GR-006 corpus registered (SF-003).

## 7. Fallback and accessibility

The free-text field is an enhancement inside the existing dialogue panel: labelled input, submit button, keyboard operable, replies announced through the existing live region, reduced-motion-safe, high-contrast styled. When absent (no opt-in, unsupported browser), the panel is visually and functionally identical to today's.

## 8. Rollback

Remove the input surface and module; the intent enum constants may remain (inert) or be removed with no save impact. Fixed-choice dialogue and its tests are untouched.
