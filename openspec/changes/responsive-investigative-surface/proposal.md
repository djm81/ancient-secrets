# Change: Responsive investigative surface for every supported orientation

## Why

The current portrait-phone fallback makes every hotspot a visible button. It is reliable, but it turns investigation into an action catalogue; compact landscape and tall desktop viewports have no complete gameplay layout contract. The game needs distinct interaction surfaces per form factor so it feels like a small adventure game rather than a scaled webpage.

## What Changes

- Add a contextual **Casebook**: at most three relevant actions beside the current objective, with an accessible “all observations” fallback.
- Define four layouts: phone portrait (scene plus bottom investigation tray), phone landscape (scene plus compact casebook rail), desktop landscape (scene-forward plus persistent rail), and desktop/tablet portrait (scene plus docked casebook).
- Preserve chronicle, focus, selected item, modal state, and scroll position across viewport changes and rotation.
- Use safe-area-aware, visual-viewport-aware controls; every essential action remains touch, pointer, and keyboard operable.

## Capabilities

- **responsive-investigative-surface** — contextual actions, orientation-safe layout, input parity, and the viewport validation matrix.

## Impact

- Affected runtime: `maestros-secret.html`, browser tests, and README manual QA.
- Supersedes the portrait-only interaction framing of `mobile-audio-hardening` without changing its audio or first-time-assistant guarantees.
- Depends on no AI service, account, or network interface; the static game remains complete.

## Constraints

- No action required for progression may depend on hover, drag, audio, orientation lock, or precision tapping.
- Primary controls are at least 44 CSS px and clear device safe areas.
- The Casebook hides completed or irrelevant actions but always provides an accessible complete action list.
- The scene remains the visual focus; UI must not expose all hotspots as the default phone experience.

## Rollback

Retain the existing scene/hotspot and portrait-action handlers behind the Casebook renderer. Reverting the new renderer restores the current static interaction surface without changing saves or puzzle rules.
