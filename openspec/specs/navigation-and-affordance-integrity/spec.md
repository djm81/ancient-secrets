# navigation-and-affordance-integrity Specification

## Purpose
TBD - created by archiving change interactive-dialogue-branches. Update Purpose after archive.
## Requirements
### Requirement: NA-001 Every visible navigation control reaches a valid destination

The scene graph SHALL define every visible arrow target. A navigation control SHALL only be visible when its target exists and its condition is satisfied. Duomo Vestibule SHALL return to Piazza and expose Whispering Gallery navigation after the bell gate unlocks; Whispering Gallery SHALL return to the Vestibule.

#### Scenario: The Duomo bell gate opens a navigation route

- **GIVEN** a player is in the Duomo Vestibule
- **WHEN** they complete the current bell sequence
- **THEN** the right navigation control names and enters the Whispering Gallery

### Requirement: NA-002 Every marked interactable has a persistent gameplay purpose

Every `data-hs` interactable SHALL have a registry entry categorized as puzzle, reusable clue, curiosity, transition, or dialogue. The Window, Easel, Candle, Candelabra, and Florence Below SHALL create persistent, reopenable Field Notes with an authored useful insight.

#### Scenario: An observation is reopened

- **GIVEN** a player has inspected the Workshop Window
- **WHEN** they open Field Notes later in the chronicle
- **THEN** the window's authored travel insight is available without revisiting the hotspot
