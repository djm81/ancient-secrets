# Change: Add authored dialogue branches and interaction integrity

## Why

The game has strong compact puzzles but its people are represented by short text exchanges, some marked objects have only disposable flavour, and scene navigation is not consistently available in the Duomo.

## What changes

- Add three original illustrated dialogue encounters for Brother Matteo, the baker, and Leonardo.
- Let the first two conversations earn an authored value that unlocks a matching successful final resolution.
- Add reusable Field Notes for the current flavour-only marked hotspots.
- Define one scene graph for arrows and direct exits, including valid Duomo return and gallery navigation.
- Add an interaction-purpose registry that covers every `data-hs` value without a flavour-only category.
- Generate and commit three local, original dialogue images; document their prompts and review decisions.

## Capabilities

- **interactive-dialogue** — deterministic, accessible choice scenes and saved earned endings.
- **dialogue-scene-art** — locally hosted, original visual assets and a reviewable art manifest.
- **navigation-and-affordance-integrity** — valid scene traversal and a complete meaningful-interaction registry.

## Impact

- The browser state schema moves from version 1 to version 2 while preserving valid existing chronicles through migration.
- Runtime changes are limited to the static game, browser-safe modules, local assets, tests, and documentation.
- No provider secret, player text, account, analytics, or runtime model call is added.

## Constraints and rollback

- Puzzle routes and completion remain authored and static-first; dialogue choices cannot make a route unsolvable.
- The published image files are local and have no runtime dependency beyond static hosting.
- Rollback is a static deployment revert. Version-2 saves are safely discarded by older code; version-1 saves migrate only when valid.
