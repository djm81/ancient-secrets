# First-time assistant specification

## ADDED Requirements

### Requirement: FTA-001 A new chronicle receives a skippable interaction orientation

The game SHALL show a first-chronicle assistant after a player starts a new chronicle. It SHALL explain how to inspect scene objects, use an item from the satchel, and navigate between scenes. The assistant SHALL have an explicit dismissal control, preserve keyboard focus, and not alter game progression.

#### Scenario: A new player begins a chronicle

- **GIVEN** no first-time assistant completion preference exists
- **WHEN** the player selects “Begin the Adventure”
- **THEN** a labelled assistant dialog describes inspection, satchel interaction, and scene navigation

#### Scenario: A player dismisses the assistant

- **GIVEN** the first-time assistant is visible
- **WHEN** the player selects its dismissal control
- **THEN** focus moves to the opening scene’s hand-mirror interaction, the chronicle remains playable, and the assistant completion preference is saved without changing the chronicle schema

#### Scenario: A returning player continues a chronicle

- **GIVEN** a valid saved chronicle exists
- **WHEN** the player selects “Continue Chronicle”
- **THEN** the first-time assistant is not shown
