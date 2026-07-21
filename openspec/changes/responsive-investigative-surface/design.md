# Design: Responsive investigative surface

## Layout model

The game has four explicit presentation modes rather than a single 16:9 stage scaled indefinitely. The renderer derives a mode from viewport width, height, orientation, and safe-area inset availability; content state is independent of the mode.

| Mode | Scene | Controls |
|---|---|---|
| Phone portrait | Upper visual field | Bottom Casebook tray with contextual actions and inventory |
| Phone landscape | Dominant scene | Compact right rail with objective, inventory, and actions |
| Desktop landscape | Scene-forward | Persistent evidence rail |
| Desktop/tablet portrait | Scene | Docked Casebook beneath scene |

## Dialogue art treatment

Desktop and tablet dialogue retains the existing 16:9 composite artwork, whose reserved parchment area supports an overlaid copy panel. Phone portrait uses a dedicated, placeholder-free compact artwork above the standalone copy panel. Phone landscape uses the same compact artwork as a left-side visual panel beside the copy, rather than cropping a desktop composite into a shallow banner. Changing viewport while a dialogue is open changes only the artwork/layout treatment; dialogue state and keyboard focus remain intact.

## Interaction model

`deriveContextualActions(state, scene)` is a pure function returning up to three most relevant next actions. The complete list remains available through “All observations”; both surfaces dispatch the existing interaction identifiers, so they cannot diverge in gameplay behavior. Used or unavailable actions leave the contextual list automatically.

## Continuity and accessibility

On `resize`, `orientationchange`, `visualViewport` resize, `pageshow`, and `visibilitychange`, the renderer changes layout only. It never creates a chronicle, resets a scene, or changes a selected inventory item. If a modal is open, focus remains inside it; if the Casebook changes container, focus returns to its corresponding action. CSS uses `dvh` with a safe fallback plus `env(safe-area-inset-*)` padding.

## Validation matrix

Test 320×568, 390×844, 430×932, 667×375, 844×390, 1024×1365, 1280×800, and 1440×900. Every size runs: start, inspect, inventory use, navigation, dialogue, puzzle step, save/resume, rotate, and continue. Physical-device evidence covers current iOS Safari and Android Chrome; desktop evidence covers current Chrome, Edge, Safari, and Firefox.

## Rollback

The Casebook is a rendering layer over existing actions. Restore the former portrait renderer and 16:9 desktop layout without a migration.
