# Offline game shell specification

## ADDED Requirements

### Requirement: OGS-001 A successful online launch enables offline core play

After one successful online launch, the cached core game SHALL launch and resume a valid chronicle with network disabled, including authored guidance, local art, and local fonts.

#### Scenario: Offline resume

- **GIVEN** a player previously launched the current game version online and saved a valid chronicle
- **WHEN** they disable network access and launch the installed app
- **THEN** the chronicle resumes and authored guidance remains usable without a network error

### Requirement: OGS-002 The cache excludes remote and AI-sensitive traffic

The service worker SHALL cache only approved same-origin GET assets. It SHALL NOT cache POST requests, remote guidance/judge responses, provider/model assets, secrets, or player-entered content.

#### Scenario: Guidance request is never cached

- **GIVEN** an optional guidance endpoint is configured
- **WHEN** a player requests guidance while the service worker controls the page
- **THEN** the request is handled normally or falls back to authored guidance, and no response is written to the app cache

### Requirement: OGS-003 Updates never interrupt an active chronicle

A newly available service-worker version SHALL wait until explicit restart or a clean title/new-chronicle boundary; it SHALL not reload, replace assets, or discard an active chronicle automatically.

#### Scenario: Update during puzzle play

- **GIVEN** a player is mid-puzzle while a new worker version is available
- **WHEN** the update is detected
- **THEN** play continues unchanged and the update becomes active only after the player chooses restart or reaches a clean boundary

### Requirement: OGS-004 Save recovery is local, explicit, and schema-validated

The player SHALL be able to export and import a chronicle through a user-initiated local file flow. Imports SHALL use the same schema validation as normal saves and SHALL reject malformed or incompatible data without replacing the current chronicle.

#### Scenario: Corrupt import preserves current progress

- **GIVEN** a valid current chronicle
- **WHEN** the player attempts to import a malformed save file
- **THEN** the import is rejected with understandable feedback and the current chronicle remains unchanged

### Requirement: OGS-005 Optional era packs are disclosed and failure-safe

Future non-core era assets SHALL be cached only after a player chooses an offline pack with an approximate size disclosure and storage check. Cache failure or eviction SHALL leave core play and saved progress usable.

#### Scenario: Insufficient storage for an era pack

- **GIVEN** an era pack whose required storage exceeds the available budget
- **WHEN** the player requests the download
- **THEN** the pack is not partially marked available, the core game remains usable, and the player receives a clear retry/online alternative
