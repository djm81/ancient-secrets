# Mobile audio specification

## ADDED Requirements

### Requirement: MA-001 Web Audio is resumed from player activation before playback

The game SHALL resume a suspended Web Audio context from a player activation before it schedules sound effects or generative music. If the browser refuses audio, the game SHALL remain playable and the music control SHALL indicate that audio is muted.

#### Scenario: A phone browser begins with a suspended context

- **GIVEN** a browser exposes a suspended `AudioContext`
- **WHEN** the player begins a chronicle or enables music
- **THEN** the game requests `resume()` and schedules music only after that request resolves

#### Scenario: A running context is later suspended

- **GIVEN** generative music is enabled and the browser later suspends its running audio context
- **WHEN** the context returns to the running state
- **THEN** the music scheduler remains active and resumes scheduling bars without requiring the player to toggle music

#### Scenario: Audio cannot be resumed

- **GIVEN** the browser rejects an audio resume request
- **WHEN** the player starts a chronicle
- **THEN** no exception blocks gameplay and the music control remains muted
