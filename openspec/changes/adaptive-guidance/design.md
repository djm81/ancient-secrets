# Design: Adaptive guidance

## 1. Signal model and suggestion function

Signals accumulate in a `struggle` block on state: `sceneEnteredAt`-derived elapsed seconds (passed in by the caller, keeping the function pure), `fruitlessInteractions` (interactions since the last state-changing action), and `guidance` history (tier and objective of past requests, dismissals per objective). `suggestTier(signals)` applies authored thresholds: escalating from none → nudge → hint as elapsed time and fruitless interactions grow, offering reveal only when a hint for the same objective was already seen. Thresholds are exported constants so tests pin them.

## 2. Persistence and save-version coordination

The `struggle` block joins the save in the next save schema version (sibling proposals also pend a bump; whichever lands first takes the number, the other rebases — the specs reference the version symbolically). Older saves migrate with an empty block. `isValidState` gains shape checks; malformed blocks reset to empty rather than invalidating the save.

## 3. Trust boundary note

No AI is required anywhere in this change. If the optional AI wording of the one-line suggestion is enabled, it flows through the existing guidance request path and validators unchanged (GR-001..005); the suggestion logic itself never consumes model output.

## 4. Accessibility

The suggestion is a polite live-region announcement plus a visible, focusable, dismissible affordance; Escape dismisses; reduced motion disables any attention animation; high contrast applies. Dismissal is remembered per objective.

## 5. Rollback

Stop rendering the surface and accumulating signals; migration keeps accepting saves with or without the block.
