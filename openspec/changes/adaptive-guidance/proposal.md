# Change: Adaptive guidance from a telemetry-free local player model

## Why

The three-tier hint system is entirely player-initiated. Players who are stuck but never open the guidance panel get no help at all, and players who ask often must guess which tier they need. A small, deterministic "struggle model" — computed purely from local gameplay signals — can suggest the right tier at the right moment without any AI service, any telemetry, or any data leaving the browser. It also demonstrates player modeling done the privacy-preserving way.

## What Changes

- Add **local struggle signals** to game state: time-on-scene, repeated interactions that produced no state change, and guidance-request history. Signals are gameplay counters, never personal data, and live only in the local save.
- Add a **pure suggestion function** `suggestTier(signals)` in `js/game-core.js`: deterministic thresholds mapping signals to no-suggestion, nudge, hint, or reveal.
- Add a **non-intrusive suggestion surface**: a dismissible, announced prompt ("The Maestro senses you may want a nudge") that opens the existing guidance panel at the suggested tier. It never auto-reveals hint content.
- Add an **opt-out** that disables signal collection and clears stored signals.
- Optional AI wording of the suggestion text inherits the existing guidance boundaries unchanged (validated, authored fallback); the feature is complete without it.

## Capabilities

- **adaptive-guidance** — signals, the pure suggestion function, the suggestion surface, and opt-out.

## Impact

- Affected runtime: `js/game-core.js` (signal accumulation, `suggestTier`, save-schema field in the next save schema version — coordinated symbolically since sibling proposals also pend a bump), suggestion surface in `maestros-secret.html`.
- **No `openspec/project.md` non-negotiable is touched**: signals are anonymous gameplay counters stored only in the existing local save, with zero egress; the AI-optional and static-first postures are unchanged; no new scene is added.
- README manual-QA checklist gains the suggestion and opt-out checks.

## Constraints

- `suggestTier` is a pure function — deterministic, Node-testable, no wall-clock reads inside (elapsed time passed in as a signal).
- Signals never leave the browser: excluded from `summarizeForGuidance` and every network path.
- The suggestion is dismissible, rate-limited (no re-prompt for the same objective after dismissal), and never renders hint text itself.
- The AI-free path is the complete path (GR-003); reduced motion and announcement rules apply to the surface.

## Rollback

Remove the suggestion surface and stop accumulating signals; the save field is additive and safely ignored by `parseSave` validation on rollback. No other path depends on it.

## Out of scope

- Any egress of signals; difficulty adjustment of puzzles themselves; cross-session aggregation beyond the single save; AI-computed scoring.
