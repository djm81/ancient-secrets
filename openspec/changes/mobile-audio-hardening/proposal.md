# Change: Harden the base game for phone play and mobile audio

## Why

At phone portrait sizes the fixed 16:9 game stage leaves too little vertical room for the title, HUD, dialogue controls, and SVG hotspots. The Web Audio context is also scheduled before a mobile browser reliably permits playback, so sound can remain silent after starting.

## What changes

- Provide a portrait phone layout that keeps the scene visible while exposing reachable, touch-sized actions for the active scene and navigation.
- Make title, HUD, inventory, panels, and dialogue readable and operable within the visual viewport at 390 × 844.
- Unlock and resume Web Audio from a user activation before scheduling effects or generative music; retain an explicit music control.
- Confirm that a resume request actually leaves the audio context running before presenting music as enabled, and re-attempt unlock on a subsequent player activation when iOS leaves it interrupted or suspended.
- Show a small, skippable first-chronicle assistant explaining inspection, satchel use, and scene navigation. Its completion is a local preference, not game state.
- Keep dialogue action controls anchored to their dialogue copy at narrow and short viewports so image cropping cannot leave choices displaced or unreachable.
- Place desktop dialogue copy in each illustration’s authored parchment area so it does not cover the character or leave the intended reading area empty.
- Add automated browser coverage for the portrait interaction path and the suspended-audio-context path.

## Capabilities

- **mobile-gameplay** — reliable portrait-phone layout and action access.
- **mobile-audio** — user-activation-safe Web Audio playback.
- **first-time-assistant** — skippable local-only interaction orientation.

## Impact

- Runtime changes are limited to `maestros-secret.html`, browser tests, README, and this OpenSpec change.
- No game save-schema, game-rule, remote-interface, provider-key, analytics, or new-scene changes.

## Constraints and rollback

- Desktop and landscape presentation remain unchanged; the portrait action surface is an alternative affordance for the same authored interactions.
- Audio remains optional and failure-safe: a blocked context never prevents play or shows a false enabled state.
- The onboarding completion preference is separately stored and safely degrades to a one-time-per-page-session assistant if browser storage is unavailable.
- Rollback is a static deployment revert; only the nonessential local onboarding preference can remain and can be cleared with site data.
