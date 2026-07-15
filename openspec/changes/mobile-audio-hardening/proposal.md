# Change: Harden the base game for phone play and mobile audio

## Why

At phone portrait sizes the fixed 16:9 game stage leaves too little vertical room for the title, HUD, dialogue controls, and SVG hotspots. The Web Audio context is also scheduled before a mobile browser reliably permits playback, so sound can remain silent after starting.

## What changes

- Provide a portrait phone layout that keeps the scene visible while exposing reachable, touch-sized actions for the active scene and navigation.
- Make title, HUD, inventory, panels, and dialogue readable and operable within the visual viewport at 390 × 844.
- Unlock and resume Web Audio from a user activation before scheduling effects or generative music; retain an explicit music control.
- Add automated browser coverage for the portrait interaction path and the suspended-audio-context path.

## Capabilities

- **mobile-gameplay** — reliable portrait-phone layout and action access.
- **mobile-audio** — user-activation-safe Web Audio playback.

## Impact

- Runtime changes are limited to `maestros-secret.html`, browser tests, and this OpenSpec change.
- No save schema, game rules, remote interface, provider key, analytics, or new content changes.

## Constraints and rollback

- Desktop and landscape presentation remain unchanged; the portrait action surface is an alternative affordance for the same authored interactions.
- Audio remains optional and failure-safe: a blocked context never prevents play.
- Rollback is a static deployment revert; no persisted state is introduced.
