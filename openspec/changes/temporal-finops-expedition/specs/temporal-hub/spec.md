# Temporal hub specification

## ADDED Requirements

### Requirement: TH-001 The workshop hub opens only after the base game is solved

The workshop hub SHALL become reachable when the base game's victory state is reached, from both a live playthrough and a resumed completed save. Before victory the hub, the Codex Rationum, and the Occhio del Tempo SHALL NOT be reachable or discoverable through any interaction, and the base game's ending SHALL be unchanged for players who stop there.

#### Scenario: Victory unlocks the hub

- **GIVEN** a player completes the base game's final puzzle
- **WHEN** the victory dialogue with the Maestro concludes
- **THEN** the workshop hub scene is offered, and the pre-existing ending remains intact if the player declines

#### Scenario: A completed v1 save enters the hub

- **GIVEN** a version 1 save whose state is post-victory
- **WHEN** the save is resumed under the new schema
- **THEN** the player can enter the workshop hub with a fresh, empty expedition

### Requirement: TH-002 Eras are chosen through fixed-choice dialogue with Leonardo

The hub SHALL present era selection exclusively through authored fixed-choice dialogue at the Occhio del Tempo. All seven eras SHALL be selectable in any order from the start. Each era option SHALL show its status (never attempted, withdrawn, complete) and Leonardo SHALL recommend, but never enforce, chronological order. No free-text input SHALL exist.

#### Scenario: Player selects an era

- **GIVEN** the player activates the Occhio del Tempo
- **WHEN** they choose Babylon from the era dialogue
- **THEN** the Babylon era scene loads and the hub state records Babylon as in progress

#### Scenario: Era statuses are visible

- **GIVEN** the player has completed Babylon and withdrawn from Rome
- **WHEN** the era dialogue is opened
- **THEN** Babylon is marked complete, Rome is marked withdrawn with a retry option, and the remaining eras are marked unattempted

### Requirement: TH-003 Completed eras permanently reveal inventions in the workshop

Each era completion SHALL permanently uncover exactly one authored Da Vinci invention in a fixed workshop alcove. Revealed inventions SHALL be inspectable through fixed-choice dialogue containing an authored description, SHALL persist across sessions, and SHALL never revert. With all seven revealed, the workshop SHALL present a completed gallery state and unlock the closing Codex dialogue.

#### Scenario: First folio reveals an invention

- **GIVEN** the player completes the Babylon trial and debrief
- **WHEN** they return to the workshop hub
- **THEN** the anemometer alcove is uncovered with an announced, reduced-motion-safe reveal, and it remains uncovered after refresh and resume

#### Scenario: Codex completion

- **GIVEN** all seven eras are complete
- **WHEN** the player returns to the hub
- **THEN** the full gallery is present and the closing dialogue reading the Codex forward becomes available

### Requirement: TH-004 The hub meets the established experience-quality standard

Every hub interaction (era selection, alcove inspection, Ledger of Mastery, closing dialogue) SHALL be fully keyboard-operable with visible focus, SHALL honor reduced-motion and high-contrast settings, and SHALL announce state changes through the existing feedback channel.

#### Scenario: Keyboard-only hub traversal

- **GIVEN** a keyboard-only player in the hub
- **WHEN** they traverse era selection, open an invention alcove, and open the Ledger of Mastery
- **THEN** every control is reachable and operable in a logical order with visible focus, and each opened panel is announced
