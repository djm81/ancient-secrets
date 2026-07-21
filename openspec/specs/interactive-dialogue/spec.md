# interactive-dialogue Specification

## Purpose
TBD - created by archiving change interactive-dialogue-branches. Update Purpose after archive.
## Requirements
### Requirement: ID-001 Dialogue choices are deterministic and earned

Brother Matteo and the baker SHALL each offer exactly one authored value choice: insight, compassion, or ambition. Each valid choice SHALL persist once, preserve core puzzle solvability, and unlock its matching successful Leonardo resolution.

#### Scenario: A baker choice preserves the bread route

- **GIVEN** a new chronicle at the baker stall
- **WHEN** the player makes any valid dialogue choice
- **THEN** the value is saved, bread is awarded, and both randomized gear routes remain playable

#### Scenario: A finale offers only earned resolutions

- **GIVEN** a chronicle with one or more earned dialogue values
- **WHEN** Leonardo opens the final dialogue
- **THEN** every matching ending is selectable, at least one ending is available, and selecting it saves the terminal resolution

#### Scenario: A terminal dialogue cannot strand a chronicle

- **GIVEN** Leonardo's final dialogue is open
- **WHEN** the player presses Escape or cycles keyboard focus
- **THEN** the ending choices remain available and keyboard focus stays within the dialogue until an ending is selected

### Requirement: ID-002 Chronicles retain compatible dialogue data

The game SHALL migrate valid version-1 saves with empty dialogue and Field Notes data. Invalid dialogue or ending data SHALL invalidate the chronicle safely.

#### Scenario: A prior chronicle resumes

- **GIVEN** a structurally valid version-1 chronicle
- **WHEN** it is loaded by the version-2 game
- **THEN** it resumes with no earned values or notes and remains playable

#### Scenario: A prior bread reward still permits its dialogue

- **GIVEN** a valid version-1 chronicle where the baker's bread was already taken
- **WHEN** it is migrated and the player returns to the baker
- **THEN** the baker dialogue remains available, records one value, and does not award duplicate bread
