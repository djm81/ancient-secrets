# Design: portrait action surface and activation-safe sound

## Portrait gameplay

At a phone portrait width (maximum 620 CSS px), the stage expands to the dynamic viewport height. Scene SVGs retain their 16:9 aspect ratio at the top of the screen so no artwork or interactable is cropped. A labelled, scrollable action surface below the scene is generated from the active scene's existing visible hotspots and the declarative navigation graph. Its native buttons are at least 44 CSS px high and call the same `interact` and `goScene` paths as the SVG and arrow controls.

The title screen and modal panels use the full viewport. Dialogue art becomes a compact header with readable, in-flow copy and choices; panels can scroll vertically rather than compressing text below legibility. The portrait rules do not apply in landscape or desktop layouts.

## Audio lifecycle

The shared `AudioContext` is created and resumed only in direct user-activation paths. To satisfy iOS's trusted-action rule, the music path initializes its graph and schedules its first real oscillator bar in the same tap/click before the asynchronous `resume()` promise settles. It then enters a visible `starting` state until `AudioContext.state === 'running'`; only then is it presented as playing and the regular scheduler continues. A resolve from `resume()` is not treated as success by itself: iOS can leave the context `interrupted` or `suspended`. In that case the control returns to muted and a later direct pointer/key activation can retry. The initial activation also primes a zero-length buffer source for compatibility with older Safari. If resumption fails, gameplay continues.

The title start, continue, mobile action, and music-control paths all pass through this shared behavior. No external media, permission prompt, telemetry, or persisted audio preference is added.

## First-chronicle assistant

After a new chronicle begins, a local, modal assistant introduces the three authored interaction modes: inspect visible objects, select an item in the satchel then use it in the scene, and use the left/right navigation controls. It has one explicit dismissal control and does not block normal progression once dismissed. Completion uses a dedicated local preference key and never changes the chronicle payload; if local storage is unavailable it remains an in-memory, once-per-page-session hint. Continuing a saved chronicle never shows it.

## Responsive dialogue controls

Dialogue art remains decorative context; its copy and controls form a single anchored control region. At narrow or short viewports the region switches to document flow beneath a bounded art header, with a scrollable modal container, so button coordinates are derived from the copy rather than the image crop. Desktop preserves the current image-overlay composition.

## Art-aware desktop dialogue placement

The authored dialogue art includes a parchment reading area: Brother Matteo and Leonardo reserve the lower left, while the baker reserves the lower right. `openDialogue()` marks the active encounter on the dialogue scene and a narrowly scoped desktop rule moves only the baker’s copy to the right. Narrow and short viewport rules continue to place every dialogue copy in normal flow, independent of art composition.

## Rollback

Removing the portrait media rules/action surface and restoring the former audio helpers returns the prior static layout. No save or deployment migration is necessary.
