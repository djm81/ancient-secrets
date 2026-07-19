# Guardrail contract specification

## ADDED Requirements

### Requirement: GR-001 Model output never mutates game state directly

No AI model reply SHALL be able to change game state (scene, inventory, flags, dialogue, notes, saves). Model output SHALL be limited to display text and identifiers that are re-validated against state computed independently by the game.

#### Scenario: Reply cannot advance progression

- **GIVEN** any model reply, however crafted
- **WHEN** the reply is processed by the game
- **THEN** milestones, inventory, scene, and save data are byte-identical to their values before the reply arrived

### Requirement: GR-002 A deterministic validator sits between every model reply and the game

Every AI capability SHALL pass model output through a deterministic validator that re-checks all structured fields against independently computed values and rejects non-conforming replies. Rejected replies SHALL be replaced by the authored fallback, never repaired or partially applied.

#### Scenario: Tampered next action is discarded

- **GIVEN** a model reply whose `nextActionId` differs from the game's own `nextActionFor(state)` result
- **WHEN** the reply is validated
- **THEN** the authored hint is served and the model reply is discarded entirely

### Requirement: GR-003 An authored fallback is always available and progression-equivalent

Every AI capability SHALL have an authored, static fallback that delivers the capability's essential function without any AI service, and the game SHALL remain fully completable using fallbacks alone.

#### Scenario: Complete playthrough with no AI configured

- **GIVEN** no AI endpoint, key, or local model is configured
- **WHEN** a player completes the game requesting guidance at every tier
- **THEN** every request is answered by authored content and progression is never blocked

### Requirement: GR-004 AI features fail closed on missing or invalid configuration

When an AI capability's configuration is absent, partial, or invalid (missing origin pinning, missing rate limiting, missing consent where required), the capability SHALL refuse AI operation and serve only authored content, rather than operating with weakened protections.

#### Scenario: Partial worker configuration refuses service

- **GIVEN** a deployed worker with an AI key but no allowed-origin or rate-limit binding
- **WHEN** any guidance request arrives
- **THEN** the worker refuses AI processing and the client falls back to the authored hint

### Requirement: GR-005 Model-visible input is restricted to an allowlisted schema

The only data any model SHALL ever see is an explicitly allowlisted, schema-validated summary. Free text, saves, identity, and any field not on the allowlist SHALL never reach a model, and servers SHALL re-validate the allowlist independently of the client.

#### Scenario: Extra fields are rejected server-side

- **GIVEN** a request containing any key outside the allowlisted guidance schema
- **WHEN** the worker validates it
- **THEN** the request is rejected before any model call occurs

### Requirement: GR-006 Every AI capability ships adversarial scenarios registered with the eval harness

Each change introducing or extending an AI capability SHALL include requirement-level adversarial scenarios (prompt injection, jailbreak, spoofed replies) in its specs and SHALL register corresponding corpus entries with the adversarial evaluation harness before the capability merges.

#### Scenario: New AI capability without corpus entries is incomplete

- **GIVEN** a proposed change adding an AI-facing feature
- **WHEN** its validation matrix is reviewed
- **THEN** it contains rows mapping its adversarial requirements to harness corpus entries, and absence of such rows blocks completion
