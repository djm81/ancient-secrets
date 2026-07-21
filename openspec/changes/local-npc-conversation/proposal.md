# Change: Bounded free-text NPC conversation, on-device only

## Why

Brother Matteo, the baker, and Leonardo speak today through fixed-choice dialogue. Letting the player ask a question in their own words deepens immersion and demonstrates the hardest responsible-AI pattern this project can showcase: free input with **provably bounded consequences**. The design is a hybrid — a language-model persona layer produces in-character flavor, while a deterministic intent boundary is the only channel that can touch game state. A jailbroken model can at worst say something odd; it can never open a lock, grant an item, or change progression.

This is acceptable only because it builds on `on-device-guidance`: all free text is processed exclusively on the player's device. Nothing the player types is ever transmitted or persisted.

## What Changes

- Add an optional **free-text input** to the existing NPC dialogue panels, rendered only when the local inference backend from `on-device-guidance` is available and opted in. Fixed-choice dialogue remains complete, always visible, and the sole progression path.
- Add a **persona layer**: the local model answers in character with short, length-capped flavor replies, grounded in an authored per-character brief; an authored deflection line replaces any rejected reply.
- Add a deterministic **intent boundary**: a classifier maps player text onto a closed intent enum (mirroring the existing authored dialogue options plus `unknown`); only a validated intent — re-checked against current game state exactly as `nextActionFor` re-checks guidance — may trigger the same authored effects the fixed choices already trigger. `unknown` is a no-op with an authored deflection.
- Add a **conversation safety layer**: a lexical filter on input and output with authored deflections, and a strict lifetime rule — player text lives in memory only, never in saves, never in any network request, discarded when the dialogue closes.

## Capabilities

- **npc-conversation** — the free-text dialogue surface, persona replies, availability gating, and fixed-choice parity.
- **intent-boundary** — the closed intent enum, schema-constrained classification, state re-validation, and jailbreak containment.
- **conversation-safety** — the lexical filter, deflections, and the no-egress/no-persistence lifetime rule.

## Impact

- Affected runtime: NPC dialogue panels in `maestros-secret.html`, new `js/npc-conversation.js`, an intent gate in `js/game-core.js` reusing the existing dialogue-choice validation.
- Depends on `ai-case-study-docs` (baseline threat model), `ai-guardrail-evals` (contract, harness), and `on-device-guidance` (browser-native inference, opt-in).
- `openspec/project.md`:
  - The third non-negotiable ("no player-entered free text in the browser payload") is **preserved, not amended** — free text is processed exclusively on device, never transmitted, never persisted to the save, and never enters the payload.
  - The fourth non-negotiable is **amended with scoped language**. Proposed wording: *"do not add … a generic chatbot" is refined to "do not add a generic, open-domain chatbot; bounded in-character NPC conversation is permitted only where (a) it runs entirely on device, (b) it can affect game state solely through the deterministic dialogue-intent enum, and (c) fixed-choice dialogue remains a complete path." The free-text non-negotiable is unchanged and binding: no player text leaves the device or enters the payload.* The amendment lands in `openspec/project.md` only when this change is accepted for implementation.
- README gains a subsection describing the hybrid persona/intent architecture and its containment guarantees.

## Constraints

- The free-text field never renders without local-inference opt-in; on any backend failure the panel silently reverts to fixed-choice only.
- Worst-case hostile input produces odd flavor text or an authored deflection — never a progression, inventory, flag, or save change.
- The persona prompt contains only the authored character brief and allowlisted scene context (GR-005); never saves, identity, or prior free text from other sessions.
- Player text lifetime is strictly in-memory: discarded when the dialogue closes, excluded from `summarizeForGuidance`, saves, and all network paths.
- Keyboard operability, announcements, reduced motion, and high contrast apply to the new input surface.

## Rollback

Remove the free-text field and `js/npc-conversation.js`; fixed-choice dialogue is untouched. No save field exists to migrate. The project.md clarification is reverted if the change is withdrawn.

## Out of scope

- Server-side conversation of any kind.
- Conversation memory across dialogues or sessions.
- NPC-initiated free-text prompts.
- New progression content reachable only through free text.
