# Design: deterministic dialogue, reusable observations, and scene graph

## State and save data

`SAVE_VERSION` becomes `2`. State gains `dialogue: { choices: { matteo, baker }, ending }` and `notes: { window, easel, candle, candelabra, duomoview }`. Choices are `insight`, `compassion`, or `ambition`; endings are `keeper`, `light`, or `flight`. Valid version-1 saves normalize to empty dialogue and note data; invalid data is rejected.

## Navigation and interaction data

`js/game-core.js` exports declarative `SCENE_GRAPH` and `INTERACTABLES` registries. The graph is the source for arrow availability, while direct exits remain interactions. Every interactable has a non-flavour category: `puzzle`, `clue`, `curiosity`, `transition`, or `dialogue`.

The five observation hotspots set a persistent Field Note. Field Notes are local, reopenable authored clues; they do not gate existing progress.

## Dialogue flow

- The baker dialogue is gated by its saved dialogue choice rather than the bread flag. This lets migrated version-1 chronicles that already hold (or consumed) bread still record the baker's value without duplicating the reward.
- Matteo's dialogue awards a value choice. Applying the lens still reveals the cipher for the monk route.
- The Secret Study shows Leonardo's dialogue. Eligible closing replies select one of three successful endings and persist before the ending panel is shown. The terminal dialogue cannot be dismissed with Escape, so it cannot leave the player in the terminal study without a selectable resolution.

All dialogue is authored locally. The existing optional guidance endpoint remains independent and cannot change dialogue state.

## Art and accessibility

Dialogue art is local WebP, lazy-decoded, and shown behind a readable parchment panel. The dialogue modal uses a labelled native-button interface, focus containment and return, high contrast, and reduced-motion-safe transitions. Prompts prohibit copying named games, artists, studios, compositions, modern people, text, logos, and watermarks.
