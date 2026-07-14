# Expedition continuity specification

## ADDED Requirements

### Requirement: EC-001 Save schema version 3 extends the chronicle with expedition state

The save schema SHALL move to version 3, embedding an expedition block (per-era status and best credit, mastery scores, revealed inventions, codex completion) alongside the existing state and run. All existing game-continuity guarantees (GC-001, GC-002) and the dialogue/notes data introduced with version 2 SHALL continue to hold for version 3 saves.

#### Scenario: Mid-expedition refresh

- **GIVEN** a player who completed Babylon, is mid-exploration in Athens, and has one invention revealed
- **WHEN** the page is refreshed and Continue is chosen
- **THEN** Babylon's completion, the revealed invention, current mastery, and the Athens in-progress exploration state are restored

#### Scenario: Mid-trial refresh resumes safely

- **GIVEN** a refresh occurs mid-way through a trial attempt
- **WHEN** the save is resumed
- **THEN** the era resumes at the trial entry with clues intact and a deterministic attempt state — either the identical seeded attempt or a cleanly restarted attempt, per the authored per-trial rule — and never a half-evaluated state

### Requirement: EC-002 Older saves migrate losslessly

A valid version 1 or version 2 save SHALL load under version 3 with all base-game state preserved exactly and a fresh initial expedition attached; version 1 saves additionally receive the existing v1→v2 dialogue/notes migration. Migration SHALL be pure, total for all valid older saves, and covered by unit tests.

#### Scenario: v2 mid-game save

- **GIVEN** a valid v2 save from before victory
- **WHEN** it is loaded under the new schema
- **THEN** play resumes exactly as v2 behavior dictated, with the expedition initialized but unreachable until victory

#### Scenario: v1 save migrates through the chain

- **GIVEN** a valid v1 save
- **WHEN** it is loaded under the new schema
- **THEN** dialogue and note data initialize per the existing v1→v2 migration and a fresh expedition is attached

### Requirement: EC-003 Corrupted expedition data degrades without losing the base game

If the expedition block of an otherwise valid save is malformed, the game SHALL restore the base-game state and attach a fresh expedition rather than discarding the whole save. A wholly invalid save SHALL keep the existing GC-002 discard behavior.

#### Scenario: Malformed expedition block only

- **GIVEN** a v3 save with valid state and run but a truncated expedition block
- **WHEN** the save is parsed
- **THEN** the base game resumes normally and the expedition restarts empty, with no exception thrown
