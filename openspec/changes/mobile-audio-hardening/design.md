# Design: portrait action surface and activation-safe sound

## Portrait gameplay

At a phone portrait width (maximum 620 CSS px), the stage expands to the dynamic viewport height. Scene SVGs retain their 16:9 aspect ratio at the top of the screen so no artwork or interactable is cropped. A labelled, scrollable action surface below the scene is generated from the active scene's existing visible hotspots and the declarative navigation graph. Its native buttons are at least 44 CSS px high and call the same `interact` and `goScene` paths as the SVG and arrow controls.

The title screen and modal panels use the full viewport. Dialogue art becomes a compact header with readable, in-flow copy and choices; panels can scroll vertically rather than compressing text below legibility. The portrait rules do not apply in landscape or desktop layouts.

## Audio lifecycle

The shared `AudioContext` is created and resumed only in direct user-activation paths. Sound effects defer their oscillator scheduling until a suspended context's `resume()` promise settles. Music marks itself enabled, waits for the context to run, then initializes its graph and schedules bars. If resumption fails, the music control returns to its muted state and gameplay continues.

The title start, continue, mobile action, and music-control paths all pass through this shared behavior. No external media, permission prompt, telemetry, or persisted audio preference is added.

## Rollback

Removing the portrait media rules/action surface and restoring the former audio helpers returns the prior static layout. No save or deployment migration is necessary.
