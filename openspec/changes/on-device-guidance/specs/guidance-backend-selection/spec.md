# Guidance backend selection specification

## ADDED Requirements

### Requirement: GB-001 The player controls the guidance backend with authored-only as default

The game SHALL offer an explicit backend preference — authored-only (default), remote worker (when an endpoint is configured), local inference (when supported and opted in) — and SHALL never switch backends without a player action.

#### Scenario: Default is authored-only

- **GIVEN** a fresh chronicle
- **WHEN** guidance is requested before any settings change
- **THEN** the authored hint path answers and no network or model activity occurs

### Requirement: GB-002 The local backend makes no application-initiated network request

With the browser-native local backend active, the application SHALL make no guidance, model, or engine asset request. Browser-managed runtime availability is outside the application's control and SHALL be recorded separately in manual evidence rather than described as application traffic.

#### Scenario: Network inspection during local guidance

- **GIVEN** the local backend is active
- **WHEN** the player requests nudge, hint, and reveal tiers while network activity is recorded
- **THEN** no application-initiated guidance, model, or engine asset request appears

### Requirement: GB-003 The backend preference persists accessibly and degrades safely

The preference SHALL persist in the local save, be operable by keyboard with announced state changes, and degrade to authored-only when a persisted backend is unavailable on resume (missing endpoint, evicted assets, unsupported browser).

#### Scenario: Resume on a less capable browser

- **GIVEN** a save with the local backend preferred, resumed in a browser without local inference support
- **WHEN** the chronicle loads and guidance is requested
- **THEN** authored hints answer, the settings surface reflects the degraded state, and the save remains valid

### Requirement: GB-004 Backend preference persistence composes with sibling save migrations

The backend preference SHALL be introduced through the ordered save-migration mechanism, preserve other additive fields, and restore the complete validated state rather than relying on a fixed list of page-level state assignments.

#### Scenario: Struggle signals survive backend-preference migration

- **GIVEN** a valid save containing the sibling struggle block but no backend preference
- **WHEN** it is parsed by a release containing the backend-preference migration
- **THEN** the struggle block is unchanged, a valid default preference is added, and both fields are restored on resume
