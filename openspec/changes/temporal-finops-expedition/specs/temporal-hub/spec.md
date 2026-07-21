# Temporal hub specification

## ADDED Requirements

### Requirement: TH-001 The workshop hub opens only after the base game is solved

The workshop hub SHALL become reachable when the base game's victory state is reached, from both a live playthrough and a resumed completed save. Before victory the hub, the Codex Rationum, and the Occhio del Tempo SHALL NOT be reachable or discoverable through any interaction, and the base game's ending SHALL be unchanged for players who stop there.

#### Scenario: Victory unlocks the hub

- **GIVEN** a player completes the base game's final puzzle
- **WHEN** the victory dialogue with the Maestro concludes
- **THEN** the workshop hub scene is offered, and the pre-existing ending remains intact if the player declines

#### Scenario: A completed pre-expedition save enters the hub

- **GIVEN** a valid version 1 or version 2 save whose state is post-victory
- **WHEN** the save is resumed under the new schema
- **THEN** the player can enter the workshop hub with a fresh, empty expedition

### Requirement: TH-002 Eras are chosen through fixed-choice dialogue with paced acts

The hub SHALL present era selection exclusively through authored fixed-choice dialogue at the Occhio del Tempo. Act I exposes Babylon, Egypt, and Athens after base-game victory; completing any two opens Act II (Rome, Champagne Fairs, Florence); completing any two Act II eras opens The Age to Come. Each available option SHALL show its status (never attempted, withdrawn, complete), remaining earlier-act eras remain selectable, and no free-text input SHALL exist.

#### Scenario: Player selects an era

- **GIVEN** the player activates the Occhio del Tempo during Act I
- **WHEN** they choose Babylon from the era dialogue
- **THEN** the Babylon era scene loads and the hub state records Babylon as in progress

#### Scenario: Era statuses are visible

- **GIVEN** the player has completed Babylon and Egypt, unlocked Act II, and withdrawn from Rome
- **WHEN** the era dialogue is opened
- **THEN** Babylon is marked complete, Rome is marked withdrawn with a retry option, and the remaining eras are marked unattempted

### Requirement: TH-005 The Codex provides a three-act mystery and value-aware resolution

The folios SHALL reveal evidence about whether systems of value serve people or enable exploitation. Act unlocks, invention reveals, and the final Codex dialogue SHALL make that question legible; the final dialogue SHALL reflect the apprentice's authored dialogue values without making any value path unavailable.

#### Scenario: Final Codex reflects accumulated choices

- **GIVEN** a player has recovered all seven folios and earned an authored dialogue value
- **WHEN** they open the closing Codex dialogue
- **THEN** the resolution references the completed evidence and presents a value-consistent ending without changing puzzle completion

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
