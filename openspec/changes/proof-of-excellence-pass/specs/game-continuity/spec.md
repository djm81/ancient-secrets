# Game continuity specification

## ADDED Requirements

### Requirement: GC-001 A valid chronicle resumes after refresh

The game SHALL save a versioned chronicle after state-changing player actions. A valid save SHALL restore route, code, bell pattern, inventory, flags, curiosities, selected scene, and visual world state. The title screen SHALL show Continue only when a valid save exists.

#### Scenario: Player refreshes mid-chronicle

- **GIVEN** the player has acquired the mirror and brass key
- **WHEN** the page is refreshed and Continue is chosen
- **THEN** both items, the matching flags, and the correct chronicle route are restored

#### Scenario: Player refreshes during a reward transition

- **GIVEN** a player has triggered a machine repair or a bread-for-gear puzzle
- **WHEN** the page is refreshed before non-essential animation or dialogue completes
- **THEN** Continue restores a playable state with the trapdoor or gear reward already available

### Requirement: GC-002 Corrupted saves fail safely

The game SHALL discard malformed, incompatible, or invalid saved data without throwing. It SHALL offer a new chronicle and SHALL NOT reuse partial state.

#### Scenario: Browser storage contains malformed data

- **GIVEN** the save value is not valid JSON or does not meet the current schema
- **WHEN** the title screen loads
- **THEN** Continue is hidden and starting a new chronicle succeeds

#### Scenario: Browser storage is unavailable

- **GIVEN** the browser denies access to local storage
- **WHEN** the game loads or a player changes game state
- **THEN** core play continues without throwing, while resume and persisted contrast are unavailable for that session
