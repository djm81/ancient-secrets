# NPC conversation specification

## ADDED Requirements

### Requirement: NC-001 Fixed-choice dialogue remains complete and always available

Every NPC encounter SHALL remain fully completable through the existing fixed-choice dialogue, which SHALL stay visible and operable whenever the free-text field is present. No progression effect, value choice, ending, or item SHALL be reachable only through free text.

#### Scenario: Parity of paths

- **GIVEN** any NPC encounter with the free-text field active
- **WHEN** the set of reachable game-state effects via free text is compared with the fixed choices
- **THEN** they are identical, and completing the encounter using only fixed choices remains possible at every moment

### Requirement: NC-002 Player text is never transmitted or persisted

Text the player types SHALL be processed exclusively on the device, SHALL never appear in any network request, SHALL never be written to browser storage or the save, and SHALL be discarded from memory when the dialogue closes.

#### Scenario: Network and save inspection

- **GIVEN** a conversation containing several free-text messages
- **WHEN** network activity is recorded throughout and the saved chronicle is inspected afterwards
- **THEN** no request contains any player text and the save contains no conversation data

### Requirement: NC-003 Persona replies are length-capped flavor with authored deflection fallback

Persona replies SHALL be display-only, capped at an authored maximum length, filtered before display, and replaced by the character's authored deflection line whenever generation fails, times out, or is rejected by validation or the safety filter.

#### Scenario: Rejected reply deflects in character

- **GIVEN** a persona reply that violates the length cap or safety filter
- **WHEN** the reply is processed
- **THEN** the authored deflection for that character is shown instead and the dialogue remains usable

### Requirement: NC-004 The free-text field renders only with local-inference opt-in

The free-text input SHALL NOT render unless the local inference backend is supported, opted in, and ready; on any backend failure mid-dialogue the field SHALL disappear gracefully, leaving the fixed-choice panel identical to the current release.

#### Scenario: No opt-in, no field

- **GIVEN** a player who has not opted into local inference
- **WHEN** any NPC dialogue opens
- **THEN** the panel is visually and functionally identical to the fixed-choice-only release
