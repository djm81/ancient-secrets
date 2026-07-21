# Design: Adaptive guidance

## 1. Signal model and suggestion function

Signals accumulate in a `struggle` block on state: caller-supplied active foreground elapsed seconds, `fruitlessInteractions` (interactions since the last state-changing action), and `guidance` history (tier and objective of past requests, dismissals per objective). The UI owns a monotonic active-play timer: it pauses on background/suspension, never stores an absolute wall-clock timestamp, and restarts its active interval on resume. `suggestTier(signals)` applies authored thresholds: escalating from none → nudge → hint as elapsed time and fruitless interactions grow, offering reveal only when a hint for the same objective was already seen. Thresholds are exported constants so tests pin them.

## 2. Persistence and save-version coordination

The `struggle` block joins the save through the ordered migration registry introduced by `temporal-finops-expedition`, rather than a hard-coded “next version” branch. This change registers its own ordered step and verifies preservation of the existing expedition and backend-preference blocks. A v2 save migrates through every ordered step, and a save that already contains either additive block preserves it while gaining an empty struggle block. The browser resume path restores the complete validated state rather than copying a fixed list of fields. `isValidState` gains shape checks; malformed struggle blocks reset to empty rather than invalidating the save.

## 3. Trust boundary note

No AI is required anywhere in this change. If the optional AI wording of the one-line suggestion is enabled, it flows through the existing guidance request path and validators unchanged (GR-001..005); the suggestion logic itself never consumes model output.

## 4. Accessibility

The suggestion is a polite live-region announcement plus a visible, focusable, dismissible affordance; Escape dismisses; reduced motion disables any attention animation; high contrast applies. Dismissal is remembered per objective.

## 5. Rollback

Stop rendering the surface and accumulating signals; migration keeps accepting saves with or without the block.
