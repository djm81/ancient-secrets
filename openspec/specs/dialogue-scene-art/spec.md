# dialogue-scene-art Specification

## Purpose
TBD - created by archiving change interactive-dialogue-branches. Update Purpose after archive.
## Requirements
### Requirement: DA-001 Dialogue art is original, local, and accessible

The game SHALL ship one local original illustration for each of Brother Matteo, the baker, and Leonardo. Each dialogue scene SHALL have meaningful alternative text, a readable foreground panel, and no network image dependency.

#### Scenario: A dialogue scene opens on a narrow display

- **GIVEN** a player opens any dialogue at 390 × 844
- **WHEN** the art and choice panel render
- **THEN** the scene remains readable, choices remain reachable, and no horizontal overflow occurs
