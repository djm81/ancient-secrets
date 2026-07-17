# Mobile audio specification

## ADDED Requirements

### Requirement: MA-001 Web Audio is resumed from player activation before playback

The game SHALL create and schedule its first generative-music sources from the same direct player activation that requests a suspended Web Audio context to resume. It SHALL show a starting state until the context is confirmed running. If the browser refuses audio, the game SHALL remain playable and the music control SHALL indicate that audio is muted.

#### Scenario: A phone browser begins with a suspended context

- **GIVEN** a browser exposes a suspended `AudioContext`
- **WHEN** the player begins a chronicle or enables music
- **THEN** the game requests `resume()` and schedules the initial music sources in that same activation, while showing that music is starting until the context is confirmed running

#### Scenario: The music control reports its actual activation state

- **GIVEN** a player taps the music control
- **WHEN** audio is waiting to resume, succeeds, or fails
- **THEN** the control respectively reports starting, playing, or muted rather than relying on a subtle visual opacity change

#### Scenario: A running context is later suspended

- **GIVEN** generative music is enabled and the browser later suspends its running audio context
- **WHEN** the context returns to the running state
- **THEN** the music scheduler remains active and resumes scheduling bars without requiring the player to toggle music

#### Scenario: Audio cannot be resumed

- **GIVEN** the browser rejects an audio resume request
- **WHEN** the player starts a chronicle
- **THEN** no exception blocks gameplay and the music control remains muted

#### Scenario: An iOS-style resume resolves without a running context

- **GIVEN** a phone browser resolves `AudioContext.resume()` while its context remains `interrupted` or `suspended`
- **WHEN** the player begins a chronicle or enables music
- **THEN** the game schedules no sound, keeps the music control muted, and retries on the next direct player activation
